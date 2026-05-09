import { chat } from "./lib/llm.js";

// OCR Agent System Prompt
const SYS_OCR_AGENT = `你是一位专业的OCR（光学字符识别）专家，负责从图片中提取并识别手写或打印的英文文字。

## 你的任务
从提供的图片中识别所有的英文文本。

## 识别要求
1. 识别所有可见的英文文本
2. 准确识别手写体和打印体
3. 保持原文的段落结构
4. 保留标点符号
5. 修正明显的拼写错误（如果明显可以识别）

## 输出格式
只输出识别到的文本，保持原样。如果图片中没有文字，请返回"No text found in image."`;

// OCR with Vision
async function performOCR(imageData, provider, apiKey, model = "") {
  try {
    // For Gemini Vision识别图片文字
    const visionPrompt = `识别图片中的所有英文文字，保持原样输出。`;

    const resp = await chat({
      provider,
      apiKey,
      model: model || "",
      messages: [
        { 
          role: "system",
          content: SYS_OCR_AGENT
        },
        {
          role: "user",
          content: visionPrompt,
          images: [imageData]  // 图片数据
        }
      ]
    });
    
    return resp.content.trim();
    
  } catch (error) {
    console.error("[OCR Agent] Error:", error);
    throw new Error(`OCR识别失败: ${error.message}`);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
  seedFromEnv().catch(e => console.warn("[essay-grader] env seed:", e?.message));
});

function parseEnvText(text) {
  const env = {};
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (value.length >= 2 && (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    )) value = value.slice(1, -1);
    env[key] = value;
  }
  return env;
}

async function loadEnvFile() {
  const candidates = [".env", ".env.example", "env.local"];
  for (const name of candidates) {
    try {
      const res = await fetch(chrome.runtime.getURL(name));
      if (!res.ok) continue;
      const env = parseEnvText(await res.text());
      const hasValues = Object.values(env).some(v => v && v.length > 0);
      if (!hasValues) continue;
      console.log(`[essay-grader] loaded env defaults from ${name}`);
      return env;
    } catch {}
  }
  return null;
}

const ENV_KEY_MAP = {
  groq: "GROQ_API_KEY",
  gemini: "GEMINI_API_KEY",
  nvidia: "NVIDIA_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
  cerebras: "CEREBRAS_API_KEY"
};

async function seedFromEnv() {
  const env = await loadEnvFile();
  if (!env || !Object.keys(env).length) return;

  const cur = await chrome.storage.local.get([
    "provider", "apiKey", "apiKeys", "model", "autoSummarize"
  ]);
  const updates = {};
  const apiKeys = { ...(cur.apiKeys || {}) };

  if (cur.apiKey && cur.provider && !apiKeys[cur.provider]) {
    apiKeys[cur.provider] = cur.apiKey;
  }

  let keysChanged = false;
  for (const [provider, envName] of Object.entries(ENV_KEY_MAP)) {
    const v = env[envName];
    if (v && v.length > 0 && apiKeys[provider] !== v) {
      apiKeys[provider] = v;
      keysChanged = true;
    }
  }
  if (keysChanged) updates.apiKeys = apiKeys;

  if (env.PROVIDER) {
    const p = env.PROVIDER.toLowerCase().trim();
    if (ENV_KEY_MAP[p] && cur.provider !== p) updates.provider = p;
  }
  if (env.MODEL && cur.model !== env.MODEL.trim()) {
    updates.model = env.MODEL.trim();
  }

  if (Object.keys(updates).length) {
    await chrome.storage.local.set(updates);
    console.log("[essay-grader] seeded settings from env:", Object.keys(updates).join(", "));
  }
}

seedFromEnv().catch(e => console.warn("[essay-grader] env seed:", e?.message));

async function getSettings() {
  const s = await chrome.storage.local.get([
    "provider", "apiKey", "apiKeys", "model", "autoSummarize", "minDwellMs", "maxAutoPerHour"
  ]);
  const provider = s.provider || "groq";
  const apiKeys = { ...(s.apiKeys || {}) };
  if (s.apiKey && !apiKeys[provider]) apiKeys[provider] = s.apiKey;
  return {
    provider,
    apiKeys,
    apiKey: apiKeys[provider] || "",
    model: s.model || "",
    autoSummarize: s.autoSummarize ?? true,
    minDwellMs: s.minDwellMs ?? 30000,
    maxAutoPerHour: s.maxAutoPerHour ?? 30
  };
}

const SYS_SENTENCE_ANALYZER = `你是一位专业的英语四级作文批改专家，负责对作文进行句子级别的详细分析。

你的任务是对输入的英文作文进行逐句分析，识别并标注以下类型的错误：

## 错误类型分类

### 1. 语法错误 (Grammar Errors)
- 主谓不一致
- 时态错误
- 冠词错误 (a/an/the)
- 介词搭配错误
- 动词形式错误
- 句子成分缺失或冗余

### 2. 词汇搭配错误 (Word Collocation Errors)
- 动词+介词搭配不当
- 形容词+名词搭配不当
- 名词+介词搭配不当
- 常见搭配错误

### 3. 逻辑衔接问题 (Logic & Coherence Issues)
- 逻辑连接词使用不当
- 句子之间缺乏过渡
- 论点与论据不匹配
- 因果关系不清晰

## 输出格式要求

请按以下JSON格式输出（每句话一行）：
---
[{"sentence":"原句","number":1,"errors":[{"type":"错误类型","original":"错误部分","correction":"修改建议","explanation":"错误解释"}],"suggestions":"改进建议"}]
---

## 评分标准（ CET-4 ）

- 内容与观点 (25分)：切题度、论点展开
- 语言准确性 (25分)：词汇、语法
- 连贯与衔接 (25分)：逻辑、过渡
- 句子结构 (25分)：多样性、复杂性

请分析这篇作文并给出详细的句子级别反馈。`;

async function analyzeSentenceLevel(essay) {
  const settings = await getSettings();
  
  const resp = await chat({
    provider: settings.provider,
    apiKey: settings.apiKey,
    model: settings.model,
    messages: [
      { role: "system", content: SYS_SENTENCE_ANALYZER },
      { role: "user", content: `请分析以下作文的每个句子：\n\n${essay}` }
    ]
  });

  return resp.content;
}

const SYS_GRADER = `你是一位专业的英语四级作文批改专家，负责对作文进行综合评分和改进建议。

## 评分标准（CET-4，总分100分）

### 1. 内容与观点 (25分)
- 切题程度 (10分)
- 论点展开 (10分)
- 思想深度 (5分)

### 2. 语言准确性 (25分)
- 词汇运用 (12分)
- 语法正确 (13分)

### 3. 连贯与衔接 (25分)
- 逻辑性 (12分)
- 过渡词使用 (8分)
- 衔接自然 (5分)

### 4. 句子结构 (25分)
- 句型多样性 (12分)
- 复杂句使用 (8分)
- 句子流畅度 (5分)

## 输出格式

请生成以下格式的报告：

# 英语四级作文批改报告

## 基本信息
- 作文题目：[题目]
- 总得分：[X/100]
- 写作字数：[X]词
- 评估时间：[日期]

## 评分详情

### 内容与观点 (X/25)
**得分：** X/25
**优点：**
- [优点1]
- [优点2]

**改进建议：**
- [建议1]

### 语言准确性 (X/25)
**得分：** X/25
**优点：**
- [优点1]

**问题与修改：**
1. 原文：[错误句子]
   错误：[错误类型]
   修改：[正确句子]
   解释：[错误原因]

2. ...

### 连贯与衔接 (X/25)
**得分：** X/25
**优点：**
- [优点1]

**改进建议：**
- [建议1]

### 句子结构 (X/25)
**得分：** X/25
**优点：**
- [优点1]

**改进建议：**
- [建议1]

## 句子级别详细标注

### 逐句分析

| 句号 | 原句 | 错误类型 | 错误内容 | 修改建议 |
|------|------|----------|----------|----------|
| 1 | [句子] | [类型] | [内容] | [建议] |
| 2 | [句子] | - | - | - |

## 综合评价

**整体评价：**
[综合评价]

**核心改进方向：**
1. [方向1]
2. [方向2]
3. [方向3]

**个性化学习建议：**
1. [建议1]
2. [建议2]
3. [建议3]

## 四级范文参考

### 优秀范文（话题相关）
[提供一篇150-200词的同类话题四级范文]

### 范文亮点分析
- [亮点1]
- [亮点2]

请根据以上标准对作文进行全面评分和改进建议。`;

async function gradeEssayFull(essay, topic = "") {
  const settings = await getSettings();
  
  const prompt = `请批改以下英语四级作文：

## 作文信息
- 题目：${topic || "未提供"}
- 字数：约${essay.split(/\s+/).length}词

## 作文内容
${essay}

请生成详细的批改报告。`;

  const resp = await chat({
    provider: settings.provider,
    apiKey: settings.apiKey,
    model: settings.model,
    messages: [
      { role: "system", content: SYS_GRADER },
      { role: "user", content: prompt }
    ]
  });

  return resp.content;
}

async function saveGradingHistory(essay, topic, result, studentId = "default") {
  const key = `grading_history_${studentId}`;
  const history = await chrome.storage.local.get([key]) || [];
  
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    topic,
    essayLength: essay.split(/\s+/).length,
    result,
    essayPreview: essay.slice(0, 200) + (essay.length > 200 ? "..." : "")
  };
  
  history.unshift(entry);
  
  if (history.length > 50) {
    history.pop();
  }
  
  await chrome.storage.local.set({ [key]: history });
  return entry;
}

async function getGradingHistory(studentId = "default") {
  const key = `grading_history_${studentId}`;
  const history = await chrome.storage.local.get([key]);
  return history[key] || [];
}

async function clearGradingHistory(studentId = "default") {
  const key = `grading_history_${studentId}`;
  await chrome.storage.local.set({ [key]: [] });
}

async function getStudentProgress(studentId = "default") {
  const history = await getGradingHistory(studentId);
  
  const progress = {
    totalEssays: history.length,
    averageScores: [],
    commonErrors: {
      grammar: 0,
      vocabulary: 0,
      logic: 0,
      structure: 0
    },
    improvementTrend: [],
    strongestArea: "",
    weakestArea: ""
  };
  
  for (const entry of history) {
    if (entry.result && entry.result.includes("总得分")) {
      const scoreMatch = entry.result.match(/总得分.*?(\d+)/);
      if (scoreMatch) {
        progress.averageScores.push(parseInt(scoreMatch[1]));
      }
    }
  }
  
  if (progress.averageScores.length >= 2) {
    const recent = progress.averageScores.slice(0, 3);
    const older = progress.averageScores.slice(-3);
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    progress.improvementTrend = [olderAvg, recentAvg];
  }
  
  return progress;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      switch (msg.type) {
        case "ocr-image": {
          const settings = await getSettings();
          const text = await performOCR(
            msg.imageData,
            settings.provider,
            settings.apiKey,
            settings.model
          );
          sendResponse({ ok: true, text });
          break;
        }
        case "grade-essay": {
          const result = await gradeEssayFull(msg.essay, msg.topic);
          const historyEntry = await saveGradingHistory(msg.essay, msg.topic, result, msg.studentId);
          sendResponse({ ok: true, result, historyEntry });
          break;
        }
        case "analyze-sentences": {
          const analysis = await analyzeSentenceLevel(msg.essay);
          sendResponse({ ok: true, analysis });
          break;
        }
        case "get-history": {
          const history = await getGradingHistory(msg.studentId);
          sendResponse({ ok: true, history });
          break;
        }
        case "clear-history": {
          await clearGradingHistory(msg.studentId);
          sendResponse({ ok: true });
          break;
        }
        case "get-progress": {
          const progress = await getStudentProgress(msg.studentId);
          sendResponse({ ok: true, progress });
          break;
        }
        case "settings": {
          sendResponse({ ok: true, settings: await getSettings() });
          break;
        }
        case "set-settings": {
          await chrome.storage.local.set(msg.settings);
          sendResponse({ ok: true });
          break;
        }
        default:
          sendResponse({ ok: false, error: `Unknown message type: ${msg.type}` });
      }
    } catch (e) {
      sendResponse({ ok: false, error: String(e?.message || e) });
    }
  })();
  return true;
});
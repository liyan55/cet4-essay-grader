import { chat } from "./lib/llm.js";

// Mock批改数据（用于离线模式）
const MOCK_GRADING_REPORT = `# 📊 英语四级作文批改报告

## 📋 作文信息
- 题目：The Importance of Reading
- 字数：106词
- 批改日期：${new Date().toLocaleDateString()}
- 批改版本：Mock（离线模式）

---

## 🎯 总体评分：**75/100**

### 评分详情

| 评分维度 | 得分 | 满分 | 评价等级 | 详细评价 |
|---------|------|------|----------|----------|
| **内容与观点** | **18/25** | 25 | B+ | 文章切题，论点明确，能围绕"阅读的重要性"展开论述，但论点深度和细节支撑不足 |
| **语言准确性** | **17/25** | 25 | B | 有少量语法错误和词汇搭配问题，但不影响整体理解，表达基本通顺 |
| **连贯与衔接** | **20/25** | 25 | A- | 逻辑清晰，段落过渡自然，使用了基本的连接词 |
| **句子结构** | **20/25** | 25 | A- | 句型有一定多样性，包含简单句和复合句，表达流畅 |

### 评分分析
- **优点**：结构完整、论点清晰、表达流畅
- **待改进**：语言准确性、内容深度

---

## ✅ 文章优点

### 内容方面
1. **主题明确**：文章紧扣"阅读的重要性"这一主题，论点清晰
2. **结构完整**：有引言（引入话题）、主体（分论点论述）、结论（总结观点）三部分
3. **论点合理**：从"获取知识"和"提高写作能力"两个角度论证阅读的重要性
4. **观点积极**：传达了阅读有益的积极价值观

### 语言表达方面
1. **表达流畅**：句子通顺，读者能够轻松理解作者意图
2. **词汇基础**：掌握了基本的四级词汇，能够表达基本概念
3. **句型多样**：使用了简单句、并列句和复合句，句式有一定变化
4. **衔接自然**：使用了"First of all", "Secondly", "In conclusion"等过渡词

---

## ⚠️ 存在问题与修改建议

### 一、典型语法错误

| 序号 | 原句 | 错误类型 | 修改建议 | 错误解释 |
|------|------|----------|----------|----------|
| 1 | *"more and more people prefer watching videos"* | 固定搭配错误 | **"more and more people prefer to watch videos"** | "prefer to do sth." 是正确搭配，"prefer doing" 不常用 |
| 2 | *"makes us know more things"* | 动词搭配不当 | **"helps us learn more"** | "make sb. do sth." 强调强迫，"help sb. do sth." 更符合语境 |
| 3 | *"keep us know"* | 动词用法错误 | **"help us learn"** 或 **"enable us to know"** | "keep" 后接动词-ing形式，此处语义也不合适 |
| 4 | *"With the rapid development of technology"* | 句式模板化 | **"In today's digital age"** 或 **"As technology advances"** | 此句过于模板化，建议使用更自然的表达 |

### 二、词汇搭配问题

| 序号 | 原句 | 问题类型 | 修改建议 | 说明 |
|------|------|----------|----------|------|
| 1 | *"makes us know more"* | 表达单调 | **"expands our knowledge"** 或 **"broadens our horizons"** | 避免重复使用"know"，使用更高级的表达 |
| 2 | *"gain knowledge"* | 搭配一般 | **"acquire knowledge"** 或 **"obtain knowledge"** | "acquire" 比 "gain" 更正式准确 |
| 3 | *"improve our writing skills"* | 搭配一般 | **"enhance our writing skills"** 或 **"develop our writing abilities"** | "enhance" 更能体现提升的意味 |

### 三、句子结构问题

1. **句子过于简单**：部分句子结构单一，建议增加复合句使用
   - 原句：*"Reading is important. It helps us."*
   - 修改：*"Reading is of great importance as it helps us..."*

2. **句子长度相似**：句子长度较为接近，建议长短句结合
   - 长句：使用从句、分词结构增加复杂度
   - 短句：用于强调重点

### 四、逻辑衔接问题

- **段落过渡生硬**：第二段和第三段之间缺乏自然过渡
  - 建议添加：*"Furthermore,"* 或 *"In addition to acquiring knowledge,"*
- **连接词使用有限**：过度依赖"First", "Second"等基础连接词
  - 建议使用：*"Moreover", "Furthermore", "Additionally", "Consequently"* 等

---

## 📝 改进建议

### 短期改进（本周可完成）

1. **语法强化**
   - 复习"prefer", "help", "make"等动词的用法
   - 重点掌握动词不定式和动名词的区别

2. **词汇提升**
   - 背诵10个常用动词搭配（如 broaden horizons, enhance skills）
   - 学习同义词替换，避免重复使用简单词汇

3. **句型练习**
   - 每天练习写2个复合句（使用状语从句、定语从句）
   - 学习使用分词短语作状语

### 中期提升（本月目标）

1. **阅读积累**
   - 每周阅读2篇四级范文
   - 摘录优秀表达和句型结构

2. **写作练习**
   - 每周写1篇150词左右的作文
   - 重点关注论点展开和细节支撑

3. **错误整理**
   - 建立个人错误档案，记录常犯语法错误
   - 定期复习，避免重复犯错

### 长期目标

1. **建立写作模板**：整理常用开头、结尾和过渡句
2. **积累话题素材**：针对常见话题积累例子和论据
3. **模拟考试训练**：定期进行限时写作练习

---

## 🎓 修改后的范文

> In today's digital age, an increasing number of people prefer watching videos online to reading books. However, reading remains of great importance in our lives.
>
> First and foremost, reading serves as a gateway to knowledge. Through reading, we can explore history, science, culture, and many other fascinating subjects. When we immerse ourselves in a book, our minds can travel across the world and beyond, acquiring valuable insights and perspectives.
>
> Furthermore, reading significantly enhances our writing skills. By studying well-written articles, we learn to organize our ideas more effectively and use vocabulary more precisely. This not only improves our academic performance but also helps us communicate more clearly in everyday life.
>
> In conclusion, reading offers countless benefits that cannot be replaced by digital media. It not only broadens our horizons but also enriches our inner world, helping us become more thoughtful and well-rounded individuals.

---

## 💪 下次改进目标

- [ ] 减少模板化表达，使用更自然的开头
- [ ] 增加复合句使用（目标：每篇至少3个复合句）
- [ ] 添加1-2个具体例子支撑论点
- [ ] 词汇多样性提升（使用至少3个高级表达）
- [ ] 使用更丰富的连接词（如 moreover, furthermore）

---

**评分参考标准**：CET-4 作文评分标准（满分100分）
- 内容与观点（25分）：切题度、论点展开、思想深度
- 语言准确性（25分）：词汇运用、语法正确
- 连贯与衔接（25分）：逻辑性、过渡词使用、衔接自然
- 句子结构（25分）：句型多样性、复杂句使用、句子流畅度`;

// 检查是否应该使用Mock模式
function shouldUseMockMode(settings) {
  return !settings.apiKey || settings.apiKey.trim() === "";
}

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
    console.log(`[OCR Agent] Starting OCR with provider: ${provider}, model: ${model}`);
    
    const visionPrompt = `Extract all English text from the image. Output only the recognized text, preserving the original layout and structure.`;

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
          images: [imageData]
        }
      ]
    });
    
    const result = resp.content.trim();
    console.log(`[OCR Agent] OCR completed, text length: ${result.length}`);
    return result;
    
  } catch (error) {
    console.error("[OCR Agent] Error:", error);
    console.error("[OCR Agent] Error details:", error.stack);
    
    if (error.message.includes("500") || error.message.includes("Internal Server Error")) {
      throw new Error(`服务器错误，请稍后重试。建议尝试切换到其他Provider（如Google Gemini）`);
    }
    
    throw new Error(`OCR识别失败: ${error.message}`);
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  try {
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
    console.log("[essay-grader] Side panel behavior set");
  } catch (e) {
    console.warn("[essay-grader] Failed to set panel behavior:", e?.message);
  }
  
  try {
    await seedFromEnv();
  } catch (e) {
    console.warn("[essay-grader] Env seed failed:", e?.message);
  }
});

chrome.runtime.onStartup.addListener(() => {
  console.log("[essay-grader] Background service worker started");
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
  
  // 如果是Mock模式，直接返回Mock数据
  if (shouldUseMockMode(settings)) {
    console.log("[essay-grader] Using mock mode (no API key)");
    return MOCK_GRADING_REPORT;
  }
  
  // 否则使用真实API
  const prompt = `请批改以下英语四级作文：

## 作文信息
- 题目：${topic || "未提供"}
- 字数：约${essay.split(/\s+/).length}词

## 作文内容
${essay}

请生成详细的批改报告。`;

  try {
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
  } catch (error) {
    console.warn("[essay-grader] API failed, falling back to mock mode:", error?.message);
    return MOCK_GRADING_REPORT;
  }
}

async function saveGradingHistory(essay, topic, result, studentId = "default") {
  const key = `grading_history_${studentId}`;
  const storageResult = await chrome.storage.local.get([key]);
  const history = storageResult[key] || [];
  
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
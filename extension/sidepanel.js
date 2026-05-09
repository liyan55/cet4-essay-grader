import { PROVIDERS } from "./lib/llm.js";
import { renderMarkdown } from "./lib/markdown.js";

window.addEventListener("error", (e) => {
  console.error("[essay-grader] uncaught:", e.error || e.message);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("[essay-grader] unhandled rejection:", e.reason);
});

const $ = (id) => document.getElementById(id);

function send(msg) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(msg, (resp) => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
      if (!resp) return reject(new Error("No response from background worker"));
      if (!resp.ok) return reject(new Error(resp.error));
      resolve(resp);
    });
  });
}

const sampleEssays = {
  reading: `With the rapid development of technology, more and more people prefer watching videos online to reading books. However, reading is still very important in our lives.

First of all, reading can help us gain knowledge. We can learn about history, science, culture and many other things by reading. When we read books, we can travel around the world in our mind.

Secondly, reading can improve our writing skills. When we read good articles, we can learn how to organize ideas and use words more effectively.

In conclusion, reading has many benefits. It not only makes us know more things but also helps us become better people.`,

  technology: `Technology has become an important part of our daily lives. It has changed the way we live, work, and communicate with each other.

One of the biggest impacts of technology is on communication. With smartphones and the internet, we can now talk to people anywhere in the world instantly.

However, technology also has some disadvantages. Some people spend too much time on their phones, which can be bad for their health.

Overall, technology has brought many benefits but we should use it wisely.`,

  environment: `Environmental protection has become an increasingly important topic in recent years. Our planet is facing many serious environmental problems.

First, air pollution is getting worse. Many factories produce harmful gases every day. Second, water pollution is also a big problem. Rivers and lakes are being polluted by waste from factories.

We should take action to protect the environment. For example, we can plant more trees, use public transportation, and reduce waste.

I believe that if everyone does their part, we can make the world a better place.`
};

// 全局状态
let currentImages = [];
let isEditMode = false;
const MAX_IMAGES = 5;

// 视图标签页切换
document.querySelectorAll(".appbar-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    const view = btn.dataset.view;
    document.querySelectorAll(".appbar-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    btn.classList.add("active");
    $(`view-${view}`).classList.add("active");
  });
});

// 输入模式切换
$("tab-text").addEventListener("click", () => {
  $("tab-text").classList.add("active");
  $("tab-image").classList.remove("active");
  $("text-input-mode").classList.remove("hidden");
  $("image-input-mode").classList.add("hidden");
});

$("tab-image").addEventListener("click", () => {
  $("tab-image").classList.add("active");
  $("tab-text").classList.remove("active");
  $("image-input-mode").classList.remove("hidden");
  $("text-input-mode").classList.add("hidden");
});

// 文字输入事件
$("essay-input").addEventListener("input", () => {
  const text = $("essay-input").value.trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  $("word-count").textContent = words;
});

// 示例作文加载
document.querySelectorAll(".sample-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const sampleKey = btn.dataset.sample;
    const essay = sampleEssays[sampleKey];
    if (essay) {
      $("essay-input").value = essay;
      $("word-count").textContent = essay.split(/\s+/).filter(Boolean).length;

      if (sampleKey === "reading") {
        $("topic-input").value = "The Importance of Reading";
      } else if (sampleKey === "technology") {
        $("topic-input").value = "Technology in Our Lives";
      } else if (sampleKey === "environment") {
        $("topic-input").value = "Environmental Protection";
      }
      
      // 自动切换到文字模式
      $("tab-text").click();
    }
  });
});

// 图片上传区域
const imageUploadArea = $("image-upload-area");

// 点击上传
imageUploadArea.addEventListener("click", () => {
  $("image-input").click();
});

// 文件选择
$("image-input").addEventListener("change", handleFileSelect);

// 拖拽上传
imageUploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  imageUploadArea.classList.add("dragover");
});

imageUploadArea.addEventListener("dragleave", () => {
  imageUploadArea.classList.remove("dragover");
});

imageUploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  imageUploadArea.classList.remove("dragover");
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFileSelect({ target: { files } });
  }
});

// 处理文件选择
async function handleFileSelect(e) {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;
  
  const validFiles = files.filter(f => f.type.startsWith("image/"));
  if (validFiles.length === 0) {
    alert("请选择图片文件！");
    return;
  }
  
  const remainingSlots = MAX_IMAGES - currentImages.length;
  const filesToAdd = validFiles.slice(0, remainingSlots);
  
  if (filesToAdd.length < validFiles.length) {
    alert(`最多只能上传${MAX_IMAGES}张图片，已添加${filesToAdd.length}张`);
  }
  
  for (const file of filesToAdd) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      currentImages.push({
        data: imageData,
        name: file.name
      });
      updateImagePreview();
    };
    reader.readAsDataURL(file);
  }
  
  e.target.value = "";
}

// 更新图片预览网格
function updateImagePreview() {
  const grid = $("image-preview-grid");
  const prompt = $("upload-prompt");
  
  if (currentImages.length === 0) {
    grid.innerHTML = "";
    prompt.classList.remove("hidden");
    grid.classList.add("hidden");
  } else {
    prompt.classList.add("hidden");
    grid.classList.remove("hidden");
    
    grid.innerHTML = currentImages.map((img, index) => `
      <div class="image-preview-item">
        <img src="${img.data}" alt="Image ${index + 1}">
        <button class="remove-image-btn" data-index="${index}">×</button>
        <span class="image-name">${img.name}</span>
      </div>
    `).join("");
    
    // 为每个删除按钮添加事件
    grid.querySelectorAll(".remove-image-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        removeImage(index);
      });
    });
  }
  
  // 更新图片计数
  $("image-count").textContent = `${currentImages.length}/${MAX_IMAGES}`;
}

// 移除单张图片
function removeImage(index) {
  currentImages.splice(index, 1);
  updateImagePreview();
  
  // 如果没有图片了，清空OCR结果
  if (currentImages.length === 0) {
    $("ocr-text-output").value = "";
    $("ocr-status").textContent = "";
  }
}

// 清除所有图片
$("clear-all-images").addEventListener("click", () => {
  currentImages = [];
  $("image-input").value = "";
  updateImagePreview();
  $("ocr-text-output").value = "";
  $("ocr-status").textContent = "";
});

// 执行OCR
$("ocr-btn").addEventListener("click", async () => {
  if (currentImages.length === 0) {
    alert("请先上传作文图片！");
    return;
  }
  
  const statusEl = $("ocr-status");
  statusEl.textContent = `正在识别第 1/${currentImages.length} 张图片...`;
  $("ocr-btn").disabled = true;
  
  try {
    let allText = "";
    
    for (let i = 0; i < currentImages.length; i++) {
      statusEl.textContent = `正在识别第 ${i + 1}/${currentImages.length} 张图片...`;
      
      const result = await send({
        type: "ocr-image",
        imageData: currentImages[i].data
      });
      
      if (result.text) {
        allText += result.text + "\n\n";
      }
    }
    
    $("ocr-text-output").value = allText.trim();
    statusEl.textContent = `识别完成！共识别 ${currentImages.length} 张图片`;
    
    if (!$("image-input-mode").classList.contains("hidden")) {
      $("essay-input").value = allText.trim();
      const words = allText.trim().split(/\s+/).filter(Boolean).length;
      $("word-count").textContent = words;
    }
    
    setTimeout(() => {
      statusEl.textContent = "";
    }, 3000);
    
  } catch (e) {
    statusEl.textContent = `识别失败: ${e.message}`;
    console.error("[OCR] Error:", e);
  } finally {
    $("ocr-btn").disabled = false;
  }
});

// 编辑OCR结果
$("edit-ocr-text").addEventListener("click", () => {
  const textarea = $("ocr-text-output");
  
  if (!isEditMode) {
    textarea.readOnly = false;
    $("edit-ocr-text").textContent = "✓ 保存编辑";
    textarea.focus();
    isEditMode = true;
  } else {
    textarea.readOnly = true;
    $("edit-ocr-text").textContent = "✏️ Edit Text (编辑)";
    
    // 同步到文字输入框
    if (textarea.value) {
      $("essay-input").value = textarea.value;
      const words = textarea.value.trim().split(/\s+/).filter(Boolean).length;
      $("word-count").textContent = words;
    }
    
    isEditMode = false;
  }
});

// 复制OCR结果
$("copy-ocr-text").addEventListener("click", async () => {
  const text = $("ocr-text-output").value;
  if (!text) {
    alert("没有可复制的文本！");
    return;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    const originalText = $("copy-ocr-text").textContent;
    $("copy-ocr-text").textContent = "✓ Copied!";
    
    setTimeout(() => {
      $("copy-ocr-text").textContent = originalText;
    }, 2000);
    
  } catch (e) {
    alert(`复制失败: ${e.message}`);
  }
});

// 开始批改
$("grade-btn").addEventListener("click", async () => {
  // 根据当前模式获取作文
  let essay = "";
  
  if (!$("text-input-mode").classList.contains("hidden")) {
    essay = $("essay-input").value.trim();
  } else {
    essay = $("ocr-text-output").value.trim();
    // 如果图片模式有内容，同步到文字输入框
    if (essay) {
      $("essay-input").value = essay;
    }
  }
  
  const topic = $("topic-input").value.trim();
  const studentId = $("student-id").value.trim() || "default";

  if (!essay) {
    alert("请先输入作文内容或上传图片！");
    return;
  }

  const resultSection = $("result-section");
  const status = $("grading-status");
  const content = $("result-content");
  const viewGrader = $("view-grader");

  resultSection.classList.remove("hidden");
  status.classList.remove("hidden");
  status.querySelector("p").textContent = "批改中，请稍候...";
  content.innerHTML = "";
  viewGrader.classList.add("result-visible");

  $("grade-btn").disabled = true;
  $("grade-btn").textContent = "批改中...";

  try {
    const result = await send({
      type: "grade-essay",
      essay,
      topic,
      studentId
    });

    status.classList.add("hidden");
    content.innerHTML = renderMarkdown(result.result);
    
    content.scrollIntoView({ behavior: "smooth" });
  } catch (e) {
    status.classList.add("hidden");
    content.innerHTML = `<div class="error-message">错误: ${e.message}</div>`;
  } finally {
    $("grade-btn").disabled = false;
    $("grade-btn").textContent = "🚀 开始批改";
  }
});

// 清除结果
$("clear-result").addEventListener("click", () => {
  const resultSection = $("result-section");
  const content = $("result-content");
  const viewGrader = $("view-grader");

  resultSection.classList.add("hidden");
  content.innerHTML = "";
  viewGrader.classList.remove("result-visible");
});

// 保存报告
$("save-report").addEventListener("click", () => {
  const content = $("result-content");
  const text = content.innerText;

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `essay-grading-${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

// 历史记录功能
$("load-history").addEventListener("click", async () => {
  const studentId = $("history-student-id").value.trim() || "default";
  const historyList = $("history-list");

  historyList.innerHTML = '<p class="muted">Loading...</p>';

  try {
    const result = await send({
      type: "get-history",
      studentId
    });

    if (!result.history || result.history.length === 0) {
      historyList.innerHTML = '<p class="muted">No history found for this student ID.</p>';
      return;
    }

    historyList.innerHTML = result.history.map(entry => `
      <div class="history-item">
        <div class="history-header">
          <span class="history-topic">${entry.topic || "No topic"}</span>
          <span class="history-date">${new Date(entry.timestamp).toLocaleDateString()}</span>
        </div>
        <p class="history-preview">${entry.essayPreview}</p>
        <details class="history-details">
          <summary>View Full Report</summary>
          <div class="history-report">${renderMarkdown(entry.result)}</div>
        </details>
      </div>
    `).join("");
  } catch (e) {
    historyList.innerHTML = `<p class="error-message">Error: ${e.message}</p>`;
  }
});

// 清除历史
$("clear-history").addEventListener("click", async () => {
  const studentId = $("history-student-id").value.trim() || "default";

  if (!confirm("Are you sure you want to clear all history?")) return;

  try {
    await send({
      type: "clear-history",
      studentId
    });
    $("history-list").innerHTML = '<p class="muted">History cleared.</p>';
  } catch (e) {
    alert(`Error: ${e.message}`);
  }
});

// 学习进度
$("load-progress").addEventListener("click", async () => {
  const studentId = $("progress-student-id").value.trim() || "default";

  try {
    const result = await send({
      type: "get-progress",
      studentId
    });

    const progress = result.progress;

    $("total-essays").textContent = progress.totalEssays || 0;

    if (progress.averageScores && progress.averageScores.length > 0) {
      const avg = progress.averageScores.reduce((a, b) => a + b, 0) / progress.averageScores.length;
      $("average-score").textContent = avg.toFixed(1);
    } else {
      $("average-score").textContent = "N/A";
    }

    if (progress.improvementTrend && progress.improvementTrend.length === 2) {
      const [old, recent] = progress.improvementTrend;
      const diff = recent - old;
      const arrow = diff > 0 ? "↑" : diff < 0 ? "↓" : "→";
      $("improvement-trend").textContent = `${arrow} ${Math.abs(diff).toFixed(1)} points`;
    } else {
      $("improvement-trend").textContent = "N/A";
    }

    if (progress.strongestArea) {
      $("strongest-area").textContent = progress.strongestArea;
    } else {
      $("strongest-area").textContent = "N/A";
    }

    if (progress.weakestArea) {
      $("weakest-area").textContent = progress.weakestArea;
    } else {
      $("weakest-area").textContent = "N/A";
    }

  } catch (e) {
    alert(`Error: ${e.message}`);
  }
});

// 设置功能
$("open-settings").addEventListener("click", openSettings);
$("close-settings").addEventListener("click", closeSettings);
$("settings-modal").querySelector(".modal-backdrop").addEventListener("click", closeSettings);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSettings();
});

function populateProviderSelect() {
  const sel = $("provider");
  if (sel.options.length) return;
  for (const [key, cfg] of Object.entries(PROVIDERS)) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = cfg.label;
    sel.appendChild(opt);
  }
}

function refreshModelOptions(provider) {
  const cfg = PROVIDERS[provider];
  const dl = $("model-options");
  dl.innerHTML = "";
  for (const m of cfg.models) {
    const o = document.createElement("option");
    o.value = m;
    dl.appendChild(o);
  }
  $("model").placeholder = `default: ${cfg.defaultModel}`;
  $("keys-link").href = cfg.keysUrl;
}

let cachedApiKeys = {};

async function openSettings() {
  populateProviderSelect();
  const { settings } = await send({ type: "settings" });
  cachedApiKeys = { ...(settings.apiKeys || {}) };
  $("provider").value = settings.provider;
  $("apiKey").value = cachedApiKeys[settings.provider] || "";
  $("model").value = settings.model;
  refreshModelOptions(settings.provider);
  $("settings-modal").classList.remove("hidden");
}

function closeSettings() {
  $("settings-modal").classList.add("hidden");
}

$("provider").addEventListener("change", () => {
  const previousProvider = $("provider").dataset.last || $("provider").value;
  cachedApiKeys[previousProvider] = $("apiKey").value.trim();
  const next = $("provider").value;
  $("provider").dataset.last = next;
  $("apiKey").value = cachedApiKeys[next] || "";
  refreshModelOptions(next);
});

$("save-settings").addEventListener("click", async () => {
  const provider = $("provider").value;
  const apiKey = $("apiKey").value.trim();
  cachedApiKeys[provider] = apiKey;
  const settings = {
    provider,
    apiKeys: cachedApiKeys,
    apiKey,
    model: $("model").value.trim(),
  };
  try {
    await send({ type: "set-settings", settings });
    $("settings-status").textContent = "Saved.";
    setTimeout(() => {
      $("settings-status").textContent = "";
      closeSettings();
    }, 1000);
  } catch (e) {
    $("settings-status").textContent = `Error: ${e.message}`;
  }
});

(async () => {
  const { settings } = await send({ type: "settings" });
  if (!settings.apiKey) openSettings();
})();
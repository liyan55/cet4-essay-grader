# CET4 Essay Grader

一个**易操作、评阅细致、可追踪学习过程**的智能作文批改系统。

**Track:** `multi-agent`
**Base / fork source:** memo-in-browser-ag2 (https://github.com/amlworks/ag2-browser-agent.git)
**AG2 version:** `ag2 >=0.2.0`

---

## 🎯 一句话定位

**输入：** 英语CET4作文（100-200词）或手写作文图片
**输出：** 详细的逐句批改报告 + 个性化学习建议 + 学习进度追踪

一个Chrome浏览器扩展，帮助学生有效提升四级写作能力，减轻教师负担。

---

## ✨ 核心功能

### 1. 📝 双模式输入
- **文字输入模式**：直接输入或粘贴作文
- **图片上传模式**：上传手写或打印作文图片，自动识别
- **拖拽上传**：支持拖拽图片文件到上传区域

### 2. 🔍 OCR文字识别
- 手写和打印文字自动识别
- 识别结果可编辑和复制
- 实时预览和状态反馈
- 自动同步到文字输入框

### 3. 句子级错误标注
- 自动识别作文中的每个句子
- 逐句标注语法错误、词汇搭配不当、逻辑衔接问题
- 给出具体修改建议

### 4. 🔍 三类错误分类
| 错误类型 | 示例 |
|---------|------|
| **语法错误** | 主谓不一致、时态错误、冠词错误 |
| **词汇搭配** | 动词+介词、形容词+名词搭配不当 |
| **逻辑衔接** | 过渡词缺失、逻辑连接词使用不当 |

### 5. 📊 四级评分标准
| 维度 | 分值 | 说明 |
|------|------|------|
| 内容与观点 | 25分 | 切题度、论点展开 |
| 语言准确性 | 25分 | 词汇、语法 |
| 连贯与衔接 | 25分 | 逻辑、过渡 |
| 句子结构 | 25分 | 多样性、复杂性 |

### 6. 📚 批改历史追踪
- 记录每个学生的所有批改记录
- 追踪学习进步趋势
- 识别常见错误类型

### 7. 📈 学习进度可视化
- 总作文数、平均分
- 进步趋势图
- 强项与弱项分析

---

## 🚀 5分钟快速上手

```bash
# 1. 克隆项目
git clone https://github.com/liyan55/cet4-essay-grader.git
cd cet4-essay-grader

# 2. 配置API密钥
cp extension/.env.example extension/.env
# 编辑 .env 文件，填入你的 API Key

# 3. 加载扩展到Chrome
# - 打开 chrome://extensions/
# - 启用开发者模式
# - 点击"加载已解压的扩展程序"
# - 选择 extension/ 文件夹
```

---

## 🎨 使用界面

### 主界面功能
1. **输入选择** - 文字/图片两种输入模式切换
2. **图片上传** - 拖拽或点击上传作文图片
3. **OCR识别** - 一键识别图片中的文字
4. **开始批改** - 一键获取详细批改报告
5. **查看历史** - 回顾所有批改记录
6. **学习进度** - 可视化学习成果

### 示例作文
- 📚 The Importance of Reading
- 💻 Technology in Our Lives
- 🌍 Environmental Protection

---

## 🏗️ 多Agent架构

本项目使用AG2启发的工具调用Agent模式：

```
┌──────────────┐
│  Main Agent  │ ←─── 协调器
└──────┬───────┘
       │ calls
       ▼
┌──────────────┐     ┌──────────────┐
│ Content      │     │ Logic       │
│ Reviewer     │     │ Reviewer     │
└──────────────┘     └──────────────┘
       │                   │
       ▼                   ▼
┌──────────────┐     ┌──────────────┐
│ Vocabulary   │     │ Grammar      │
│ Coach        │     │ Judge        │
└──────────────┘     └──────────────┘
       │
       ▼
┌──────────────┐
│ Structure    │
│ Analyzer     │
└──────────────┘
```

每个Agent负责一个维度，最后由主Agent汇总生成完整报告。

---

## 📂 项目结构

```
cet4-essay-grader/
├── README.md              # 项目文档
├── AI_LOG.md              # AI迭代记录
├── ATTRIBUTION.md         # 拿来主义说明
├── requirements.txt        # 依赖声明
├── LICENSE                # MIT许可证
└── extension/
    ├── manifest.json      # Chrome扩展配置
    ├── .env.example       # 环境变量模板
    ├── background.js      # 核心Agent逻辑
    ├── sidepanel.html/.js # 用户界面
    └── lib/
        ├── llm.js        # LLM客户端
        └── markdown.js   # Markdown渲染
```

---

## 🎓 批改报告示例

### 输入方式一：文字输入
**题目：** The Importance of Reading
**作文：**
> With the rapid development of technology, more and more people prefer watching videos online to reading books. However, reading is still very important in our lives...

### 输入方式二：图片上传
**上传：** 手写作文照片
**识别：** 自动OCR识别文字 → 编辑确认 → 开始批改

### 输出
**总分：** 78/100

| 维度 | 得分 | 说明 |
|------|------|------|
| 内容与观点 | 18/25 | 切题，论点展开较好 |
| 语言准确性 | 18/25 | 有几处词汇搭配问题 |
| 连贯与衔接 | 20/25 | 过渡词使用得当 |
| 句子结构 | 22/25 | 句型多样，表达流畅 |

**逐句标注：**
| 句号 | 原句 | 错误类型 | 修改建议 |
|------|------|----------|----------|
| 1 | more and more people prefer... | 词汇搭配 | prefer → prefer to |
| 2 | ...books. However, reading is... | - | ✓ 正确 |
| 3 | First of all, reading can help... | - | ✓ 正确 |

---

## 📊 学习追踪功能

### 学生端
- 记录每次批改
- 查看历史批改报告
- 追踪学习进步

### 教师端（开发中）
- 查看所有学生进度
- 识别班级共性问题
- 生成班级报告

---

## 🔧 技术栈

| 层级 | 技术 |
|------|------|
| 运行时 | Chrome Manifest V3 扩展 |
| UI | 原生 HTML/CSS/JS |
| Agent | AG2启发的工具调用模式 |
| OCR | 多模态LLM视觉识别 |
| LLM | OpenRouter, Gemini, Groq, Cerebras |

---

## 📋 C5-AG2 任务完成清单

- ✅ GitHub 仓库创建
- ✅ 多Agent协作（5个专业Agent + 1个OCR Agent）
- ✅ 双模式输入（文字 + 图片）
- ✅ AI_LOG.md（7轮迭代）
- ✅ ATTRIBUTION.md（拿来主义说明）
- ✅ README.md（详细文档）
- ✅ LICENSE（MIT许可证）
- ✅ requirements.txt（依赖声明）
- ✅ Chrome扩展可运行

---

## 🎥 演示视频

观看完整功能演示：

https://videotourl.com/videos/1778588681636-8c302cf4-9cf6-42e6-8d75-95ad9c7f9146.mp4

**演示内容：**
- ✅ 多图片上传功能（最多5张）
- ✅ OCR文字识别过程
- ✅ 详细的批改报告
- ✅ 学习进度追踪

---

## 📝 使用许可

MIT. See `LICENSE`.

## 🙏 致谢

- 基于 [memo-in-browser-ag2](https://github.com/amlworks/ag2-browser-agent)
- 灵感来自 AG2 (AutoGen 2) hackathon 模式

---

## 🆕 更新日志

### v1.2.0 - 2026-05-10
- 新增：多图片上传支持（最多5张）
- 新增：图片网格预览展示
- 新增：单张图片删除功能
- 新增：批量清除所有图片
- 新增：OCR批量识别并合并结果
- 优化：OCR处理进度显示
- 优化：固定底部操作栏
- 修复：批改按钮被内容遮挡问题

### v1.1.0 - 2026-05-09
- 新增：添加OCR图片识别功能
- 新增：双模式输入（文字/图片）
- 新增：拖拽上传支持
- 新增：OCR结果编辑和复制
- 优化：用户界面优化

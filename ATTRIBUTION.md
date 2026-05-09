# ATTRIBUTION - CET4 Essay Grader

拿来主义说明 for C5-AG2 hackathon

---

## 1. Base Repository / Fork Source

**Original Project:** memo-in-browser-ag2
**GitHub URL:** https://github.com/amlworks/ag2-browser-agent.git
**Author:** Amy
**Reference:** c5-ag2-hackathon-starter/samples/submitted_repos.md

### What was reused:
- Chrome Manifest V3 extension structure
- Background service worker pattern
- LLM client (`lib/llm.js`)
- Markdown renderer (`lib/markdown.js`)
- Settings modal UI components
- API key management pattern

### What was modified:
- **manifest.json**: Changed name, description, permissions
- **background.js**: Replaced memory-agent logic with essay grading tools
- **sidepanel.html**: New essay submission form
- **sidepanel.js**: New grading workflow
- **README.md**: Updated documentation
- **lib/tools.js**: Replaced browser history tools with grading tools

---

## 2. AG2 Documentation References

**Source:** c5-ag2-hackathon-starter/references/ag2_docs/

**Referenced files:**
- 10_beta_motivation.mdx - AG2 Beta introduction
- 11_beta_agents.mdx - Agent creation patterns
- 13_beta_task_delegation.mdx - Task delegation patterns

---

## 3. License Compliance

**Original License:** MIT
**Our License:** MIT

All reused code respects the original license terms.

---

## 4. Original Content Percentage

| Component | % Original | Notes |
|-----------|------------|-------|
| Extension Framework | 60% | Based on memo-in-browser-ag2 |
| LLM Client | 100% | Reused as-is |
| Markdown Renderer | 100% | Reused as-is |
| Agent Logic | 90% | Original grading implementation |
| UI Design | 80% | Original essay grader UI |
| Documentation | 95% | Original content |

---

## 5. Declaration

I, liyan55, declare that:
- All reused components are properly attributed
- The grading logic and UI are original work
- All licenses are respected
- This submission follows C5-AG2 guidelines

Signature: liyan55
Date: 2026-05-09
# 农历生日提醒 (Lunar Birthday Reminder)

基于农历的生日管理与提醒应用，支持多套实现（Next.js / Vite + React），可按需选用或二次开发。

## 功能概览

- 🎂 **农历生日**：录入农历生日，自动换算当年公历日期
- 📅 **日历视图**：月历展示当月生日与节日
- 🔔 **提醒**：即将到来的生日（如 14 天内）提醒
- 🏮 **节日**：可选显示农历节日（春节、端午等）
- 💾 **本地存储**：数据存于浏览器，无需后端
- 📱 **响应式**：适配桌面与移动端

## 项目结构（多实现）

本仓库为多子项目结构，每个子目录是一套可独立运行的应用：

| 目录 | 技术栈 | 说明 |
|------|--------|------|
| **coze/** | Next.js 16 + shadcn/ui + pnpm | 扣子编程 CLI 创建，完整 UI 组件与规范 |
| **cursor/** | Vite + React (JSX) | 轻量版，Vite 开发体验 |
| **gemini/** | Vite + React (TypeScript) | AI Studio 导出版，TypeScript |
| **kimi/** | Vite + React (TypeScript) + Tailwind | 多语言版（中/英等），可爱 UI |

每个子项目均可单独克隆或只使用其目录进行开发、部署。

## 快速开始

### 运行任一子项目

**coze（Next.js，需 pnpm）**

```bash
cd coze
pnpm install
pnpm dev
# 浏览器打开 http://localhost:5000（或脚本指定端口）
```

**cursor（Vite + React）**

```bash
cd cursor
npm install
npm run dev
```

**gemini（Vite + TypeScript）**

```bash
cd gemini
npm install
npm run dev
```

**kimi（Vite + TypeScript + 多语言）**

```bash
cd kimi
npm install
npm run dev
```

具体端口以终端输出为准（通常为 `http://localhost:5173` 等）。

### 构建生产版本

进入对应子目录后执行：

- **coze**: `pnpm build`，然后 `pnpm start`
- **cursor / gemini / kimi**: `npm run build`，产物在 `dist/`，可用 `npm run preview` 本地预览

## 技术栈摘要

- **农历计算**：各子项目使用 `lunar-javascript`、`solarlunar` 等库
- **UI**：React 18/19，部分使用 Tailwind、shadcn/ui、Framer Motion
- **包管理**：coze 使用 pnpm，其余子项目多为 npm

更多细节见各子目录下的 `README.md`。

## 文档与规范

- [贡献指南](CONTRIBUTING.md) — 如何参与开发与提 PR
- [更新日志](CHANGELOG.md) — 版本与重要变更记录
- [LICENSE](LICENSE) — 本项目采用 MIT 许可证

## 许可证

MIT License。详见 [LICENSE](LICENSE) 文件。

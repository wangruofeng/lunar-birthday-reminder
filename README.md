# 农历生日提醒 (Lunar Birthday Reminder)

基于农历的生日管理与提醒应用，支持多套实现（Next.js / Vite + React），可按需选用或二次开发。

**在线预览**：<https://blog.wangruofeng007.com/lunar-birthday-reminder/>

## 功能概览

- 🎂 **农历生日管理**：录入农历生日，自动换算当年公历日期
- 📅 **日历视图**：月历展示当月生日与节日，支持快速跳转
- 🔔 **智能提醒**：自动扫描未来 7 天内的生日，实时提醒
- 🏮 **节日显示**：可选显示中国法定节假日
- ✨ **表单校验**：实时校验输入内容，确保数据有效性
- 💾 **本地存储**：数据存于浏览器，无需后端
- 📱 **响应式设计**：适配桌面与移动端
- 🎨 **优雅交互**：流畅动画，直观操作

## 项目结构（多实现）

本仓库为多子项目结构，每个子目录是一套可独立运行的应用：

| 目录 | 技术栈 | 说明 |
|------|--------|------|
| **coze/** | Next.js 16 + shadcn/ui + pnpm | 扣子编程 CLI 创建，完整 UI 组件与规范 |
| **cursor/** | Vite + React (JSX) + Framer Motion | 轻量版，Vite 开发体验，优雅动画交互 |
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

具体端口以终端输出为准（通常为 `http://localhost:3001`、`http://localhost:5173` 等）。

### 构建生产版本

进入对应子目录后执行：

- **coze**: `pnpm build`（静态导出到 `out/`），可用 `pnpm start` 本地预览
- **cursor / gemini / kimi**: `npm run build`，产物在 `dist/`，可用 `npm run preview` 本地预览

## 核心特性

### 1. 农历生日管理

- 支持录入农历生日（年份可选）
- 自动换算为公历日期用于提醒和日历展示
- 支持编辑和删除生日信息
- 表单实时校验，确保输入有效

### 2. 日历视图

- 月历形式展示，清晰直观
- 生日日期高亮标记
- 支持显示中国法定节假日（可开关）
- 快速跳转到指定月份
- 显示当月生日人数统计

### 3. 智能提醒

- 自动扫描未来 7 天内的生日
- 显示剩余天数（"今天"、"X 天后"）
- 一键手动刷新扫描
- 优雅的空状态提示

### 4. 生日列表

- 展示所有已录入的生日
- 显示关系标签（灰色弱化显示）
- 支持快速编辑和删除
- 点击生日快速跳转到对应月份

## 技术栈摘要

- **农历计算**：`solarlunar` 库进行农历公历换算
- **UI 框架**：React 18、Framer Motion 动画库
- **构建工具**：Vite（cursor/gemini/kimi）、Next.js（coze）
- **状态管理**：React Hooks（useState、useEffect、useMemo）
- **数据持久化**：浏览器 localStorage
- **样式方案**：CSS 变量 + 自定义样式

## 技术亮点

### cursor 子项目特性

- ✨ **Framer Motion** 流畅动画过渡
- 🎯 **组件化设计**，可维护性强
- 💡 **InfoTooltip** 组件，智能提示信息展示
- 📊 **实时表单校验**，提升用户体验
- 🎨 **精心调优的视觉效果**，层次分明

### UI/UX 设计

- 温暖优雅的配色方案
- 卡片式布局，层次清晰
- 响应式设计，适配多种屏幕
- 等宽字体显示数字，避免抖动
- 合理的间距和留白

## 文档与规范

- [贡献指南](CONTRIBUTING.md) — 如何参与开发与提 PR
- [更新日志](CHANGELOG.md) — 版本与重要变更记录
- [部署文档](DEPLOYMENT.md) — 部署相关说明
- [LICENSE](LICENSE) — 本项目采用 MIT 许可证

## 许可证

MIT License。详见 [LICENSE](LICENSE) 文件。

# 更新日志

本文件记录「农历生日提醒」项目的重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 修复

#### cursor 项目
- 修复日历周起始日，从周一改为周日，符合国内使用习惯
- 修复跨年生日的日历显示逻辑，正确标记农历12月的生日
- 修复生日列表重复显示同一人的问题
- 修复生日tooltip在边缘被遮挡的问题，自动检测并调整显示位置
- 优化性能：使用 useCallback 避免不必要的函数重新创建
- 优化日历显示：隐藏非当前月份的单元格（完全透明占位）

#### coze 项目
- 调整生日列表中农历和阳历标签的间距，使用 `gap-4` 保持适当距离

### 更改

#### gemini 项目
- UI文案调整：将"小伙伴们"改为"生日列表"
- 生日列表增强：卡片中新增阳历生日日期信息显示
- 优化布局：农历和阳历生日使用 `gap-3` 保持适当距离

#### kimi 项目
- UI文案调整：将"小伙伴们"改为"生日列表"
- 生日列表增强：卡片中新增阳历生日日期信息显示
- 优化布局：农历和阳历生日使用 `gap-3` 保持适当距离
- 更新多语言翻译：添加 `solar` 字段支持

### 新增

#### cursor 项目
- 节假日数据扩展：新增 2024、2025、2027 年完整节假日数据
- 生日列表动态计算：使用真实当前年份显示"今年生日"，不受日历跳转影响

## 1.0.0

### 新增

- 项目根目录文档：README、CONTRIBUTING、CHANGELOG、LICENSE、.gitignore，便于发布到 GitHub

### 说明

- **coze**：Next.js 16 + shadcn/ui，扣子编程 CLI 创建，使用 pnpm
- **cursor**：Vite + React (JSX)，轻量实现
- **gemini**：Vite + React (TypeScript)，AI Studio 导出版
- **kimi**：Vite + React (TypeScript) + 多语言，Tailwind 样式

---

*首次发布前的历史改动未在此逐条列出，后续版本将在此追加。*

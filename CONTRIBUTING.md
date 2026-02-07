# 贡献指南

感谢你对「农历生日提醒」项目的关注。欢迎通过 Issue、PR 或文档改进参与贡献。

## 如何贡献

### 报告问题

- 在 GitHub 仓库的 Issues 中搜索是否已有类似问题
- 若无，新建 Issue，并尽量说明：
  - 使用的子项目（coze / cursor / gemini / kimi）
  - 环境（系统、Node 版本、浏览器）
  - 复现步骤与期望行为

### 提交代码（Pull Request）

1. **Fork 本仓库**，在你自己 fork 的仓库中创建分支（如 `feature/xxx` 或 `fix/xxx`）
2. **在对应子项目中修改**：  
   - 只改一个子项目时，变更尽量集中在该子目录内  
   - 若修改会影响多个子项目（如根目录文档、公共脚本），请说明影响范围
3. **保持风格一致**：  
   - 各子项目已有 ESLint/Prettier 的，请先运行 `npm run lint` 或 `pnpm lint`  
   - coze 使用 pnpm，其余子项目多为 npm，请在对应目录下安装与运行命令
4. **提交信息**：  
   - 建议使用简短清晰的中文或英文说明（如「修复 coze 日历农历转换错误」）
5. **发起 PR**：  
   - 目标分支为 `main`（或仓库默认分支）  
   - 在描述中说明改动内容、相关 Issue（如有）  
   - 通过 CI / 本地测试后再提交，便于维护者合并

### 文档与翻译

- 根目录 `README.md`、`CONTRIBUTING.md`、`CHANGELOG.md`、`DEPLOYMENT.md` 的修改可直接提 PR
- 子项目内的 README、注释、多语言文案（如 kimi 的 i18n）也欢迎改进与翻译

## 开发约定

- **子项目独立**：每个子项目（coze / cursor / gemini / kimi）可独立安装依赖、构建与运行，请勿在根目录放全局 `node_modules` 或混用包管理器
- **根目录 .gitignore**：已统一忽略 `node_modules/`、`dist/`、`coverage/`、`.env*` 等，子项目无需重复提交这些内容
- **许可证**：提交的代码与文档需兼容项目采用的 MIT 许可证

## 行为准则

- 尊重不同技术选型与实现方式（Next.js / Vite、JSX / TS 等）
- 讨论对事不对人，保持友好与建设性

再次感谢你的参与。

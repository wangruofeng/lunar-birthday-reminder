# GitHub Pages 部署说明

本项目使用 GitHub Actions 自动构建和部署到 GitHub Pages。

## 部署结构

站点部署在子路径 `/lunar-birthday-reminder/` 下（如自定义域名或 `https://<user>.github.io/lunar-birthday-reminder/`）：

```
https://blog.wangruofeng007.com/lunar-birthday-reminder/
├── index.html          # 项目导航页
├── cursor/             # Cursor 版本（Vite）
├── gemini/             # Gemini 版本（Vite）
├── kimi/               # Kimi 版本（Vite）
└── coze/               # Coze 版本（Next.js 静态导出）
```

## 自动部署流程

当代码推送到 `main` 分支时，GitHub Actions 会：

1. **构建各子项目**
   - **cursor**：Vite 构建，`base: './'`（相对路径）
   - **gemini**：Vite 构建，`base: './'`（相对路径）
   - **kimi**：Vite 构建，`BASE_PATH=/lunar-birthday-reminder/kimi/`（绝对路径，避免无尾部斜杠时 404）
   - **coze**：Next.js 静态导出，`BASE_PATH` / `ASSET_PREFIX` 为 `/lunar-birthday-reminder/coze`

2. **合并构建产物**
   - 将各子项目输出合并到 `deploy/` 目录：
     - `cursor/dist/*` → `deploy/cursor/`
     - `gemini/dist/*` → `deploy/gemini/`
     - `kimi/dist/*` → `deploy/kimi/`
     - `coze/out/*` → `deploy/coze/`

3. **部署到 GitHub Pages**
   - 使用 `actions/upload-pages-artifact` 上传 `deploy/` 为制品
   - 使用 `actions/deploy-pages@v4` 部署，**不**推送到 `gh-pages` 分支

## 本地开发

各子项目本地开发端口（以实际 `package.json` 或终端输出为准）：

| 项目   | 命令           | 默认端口示例   |
|--------|----------------|----------------|
| cursor | `npm run dev`  | 3000           |
| gemini | `npm run dev`  | 3002           |
| kimi   | `npm run dev`  | 5173           |
| coze   | `pnpm dev`     | 见脚本/终端输出 |

```bash
cd cursor   # 或 gemini / kimi / coze
npm run dev # coze 使用 pnpm dev
```

## 手动触发部署

1. 打开 GitHub 仓库
2. 进入 **Actions** 标签
3. 选择 **Deploy to GitHub Pages** 工作流
4. 点击 **Run workflow** → **Run workflow**

## 相关配置

| 说明           | 文件/位置 |
|----------------|-----------|
| 工作流定义     | `.github/workflows/deploy.yml` |
| 根导航页       | `index.html` |
| cursor/gemini  | `vite.config.*` 中 `base: './'` |
| kimi           | `kimi/vite.config.ts` 中 `base: process.env.BASE_PATH \|\| './'`，CI 中设置 `BASE_PATH` |
| coze           | `coze/next.config.ts` 中 `basePath` / `assetPrefix`，CI 中设置环境变量 |

## 注意事项

- 首次部署需在仓库 **Settings → Pages** 中启用 GitHub Pages，并选择 **GitHub Actions** 作为构建源
- 确保 **Settings → Actions → General → Workflow permissions** 允许读写权限
- 若使用自定义域名，在 Pages 设置中配置后，子路径仍为 `/lunar-birthday-reminder/`

# GitHub Pages 部署说明

本项目使用 GitHub Actions 自动构建和部署到 GitHub Pages。

## 部署结构

```
https://wangruofeng.github.io/lunar-birthday-reminder/
├── (根目录) - 项目导航页面
├── /cursor/ - Cursor 版本
├── /gemini/ - Gemini 版本
├── /kimi/ - Kimi 版本
└── /coze/ - Coze 版本
```

## 自动部署流程

当代码推送到 `main` 分支时，GitHub Actions 会自动：

1. **构建所有子项目**
   - cursor: Vite 构建，base path: `/cursor/`
   - gemini: Vite 构建，base path: `/gemini/`
   - kimi: Vite 构建，base path: `/kimi/`
   - coze: Next.js 构建，base path: `/coze/`

2. **合并构建产物**
   - 将所有项目的构建输出合并到 `deploy/` 目录
   - 每个项目部署到对应的子路径

3. **部署到 GitHub Pages**
   - 自动推送到 `gh-pages` 分支
   - 触发 GitHub Pages 站点更新

## 本地开发

各子项目的本地开发端口：

- **cursor**: `http://localhost:3000/`
- **gemini**: `http://localhost:3002/`
- **kimi**: `http://localhost:5173/`
- **coze**: `http://localhost:3001/`

启动命令：
```bash
cd cursor  # 或 gemini/kimi/coze
npm run dev
```

## 手动触发部署

如果需要手动触发部署，可以：

1. 访问 GitHub 仓库
2. 点击 **Actions** 标签
3. 选择 **Deploy to GitHub Pages** 工作流
4. 点击 **Run workflow** 按钮

## 配置文件

- **GitHub Actions**: `.github/workflows/deploy.yml`
- **根导航页**: `index.html`
- **Coze 配置**: `coze/next.config.ts` (basePath)
- **Vite 配置**: 构建时通过 `--base` 参数设置

## 注意事项

- 首次部署需要在 GitHub 仓库设置中启用 GitHub Pages
- 选择 **GitHub Actions** 作为构建源
- 确保仓库设置中 **Actions > General > Workflow permissions** 已启用读写权限

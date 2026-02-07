<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1t1CyXpHkNOVy6tTk5JECelXcPsozlbV3

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 构建与部署

- 生产构建：`npm run build`，产物在 `dist/`
- 本项目使用相对路径 `base: './'`，部署到任意子路径均可正确加载资源；详见仓库根目录 [DEPLOYMENT.md](../DEPLOYMENT.md)。

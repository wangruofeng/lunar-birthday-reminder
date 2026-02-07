import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 必须用绝对 path：相对 base 在无尾部斜杠的 URL（如 /kimi）下会解析到上一级导致 404
  base: process.env.BASE_PATH || './',
  server: {
    port: 5173,
    host: true,
  },
})

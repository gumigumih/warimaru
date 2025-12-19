import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  server: {
    watch: {
      usePolling: true,   // ポーリング監視を強制
      interval: 100       // ポーリング間隔（ミリ秒）
    },
  },
  base: '/',  // カスタムドメインの場合はルートパスを使用
})

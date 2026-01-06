import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
      process.env.ANALYZE
        ? visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true,
            filename: 'dist/stats.html',
          })
        : undefined,
    ],
    server: {
      host: true,
      proxy: {
        '/admin': {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // React 核心
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            
            // TanStack 生态
            if (id.includes('@tanstack/react-router') || 
                id.includes('@tanstack/react-query') ||
                id.includes('@tanstack/react-table')) {
              return 'vendor-tanstack'
            }
            
            // Radix UI 组件
            if (id.includes('@radix-ui/react-')) {
              return 'vendor-ui'
            }
            
            // 图表库
            // if (id.includes('recharts')) {
            //   return 'vendor-charts'
            // }
          }
        }
      }
    }
  }
})

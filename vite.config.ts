import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { name, version } from './package.json'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const release = `${name}@${version}`
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
      sentryVitePlugin({
        org: 'taropay',
        project: 'taropay_admin',
        release: {
          name: release,
        },
        authToken: env.SENTRY_AUTH_TOKEN,
        sourcemaps: {
          // As you're enabling client source maps, you probably want to delete them after they're uploaded to Sentry.
          // Set the appropriate glob pattern for your output folder - some glob examples below:
          filesToDeleteAfterUpload: [
            './**/*.map',
            '.*/**/public/**/*.map',
            './dist/**/client/**/*.map',
          ],
        },
      }),
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
    define: {
      __RELEASE__: JSON.stringify(release),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    build: {
      sourcemap: 'hidden',
      rollupOptions: {
        output: {
          manualChunks(id) {
            // React 核心
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }

            // TanStack 生态
            if (
              id.includes('@tanstack/react-router') ||
              id.includes('@tanstack/react-query') ||
              id.includes('@tanstack/react-table')
            ) {
              return 'vendor-tanstack'
            }

            // Radix UI 组件
            if (id.includes('@radix-ui/react-')) {
              return 'vendor-ui'
            }
          },
        },
      },
    },
  }
})

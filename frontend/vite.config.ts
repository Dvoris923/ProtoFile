import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
      alias: {
        // Створюємо аліас для зручного доступу до стилів
        '@styles': path.resolve(__dirname, './src/styles'),
      },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Додаємо шляхи, де Sass має шукати файли
        includePaths: ['src/styles'],
        // Або для новіших версій:
        loadPaths: ['src/styles'],
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/',
    build: {
        outDir: '../src/main/resources/static',
        emptyOutDir: true,
        assetsDir: 'assets',
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080', // port backend Spring Boot của mày
                changeOrigin: true,
                secure: false,
            },
        },
    },
})

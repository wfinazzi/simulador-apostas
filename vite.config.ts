import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
              name: 'Nome do Seu App',
              short_name: 'App',
              start_url: '/',
              display: 'standalone',
              background_color: '#ffffff',
              theme_color: '#0f172a', // ajuste conforme seu tema
              icons: [
                {
                  src: '/icons/web-app-manifest-192x192.png',
                  sizes: '192x192',
                  type: 'image/png',
                },
                {
                  src: '/icons/web-app-manifest-512x512.png',
                  sizes: '512x512',
                  type: 'image/png',
                },
              ],
            },
          }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
});

import tailwindcss from '@tailwindcss/vite';
import plugin from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { env } from 'process';

const target =
    env.ASPNETCORE_HTTPS_PORT
        ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
        : env.ASPNETCORE_URLS
            ? env.ASPNETCORE_URLS.split(';')[0]
            : 'https://localhost:7048';

export default defineConfig({
    optimizeDeps: {
        include: [
            '@fullcalendar/react',
            '@fullcalendar/react/daygrid',
            '@fullcalendar/react/interaction',
            '@fullcalendar/react/themes/monarch',
        ]
    },

    plugins: [basicSsl(), plugin(), tailwindcss()],

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },

    server: {
        strictPort: true,
        open: false,
        port: parseInt(env.DEV_SERVER_PORT || '60922'),
        proxy: {
            '^/api': {
                target,
                secure: false
            }
        }
    }
});
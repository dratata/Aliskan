import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
export default defineConfig({plugins:[react(),tailwind()],build:{rollupOptions:{output:{manualChunks(id){if(id.includes('/node_modules/zod/'))return 'validation';if(['/node_modules/react/','/node_modules/react-dom/','/node_modules/scheduler/'].some(x=>id.includes(x)))return 'react-vendor'}}}},test:{include:['tests/**/*.test.ts']}});

import { default as react } from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default () => {
  const env = loadEnv('all', process.cwd());

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api/boundaries': {
          target: env.VITE_BOUNDARIES_URL ?? env.VITE_PROXY_URL+'/boundaries',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/boundaries/, ''),
        },
        '/api': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      },
    },
    assetsInclude: ['**/*.png'],
  });
};

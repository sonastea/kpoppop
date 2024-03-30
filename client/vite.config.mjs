import react from '@vitejs/plugin-react';
import Unfonts from 'unplugin-fonts/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.indexOf('node_modules') !== -1) {
              const basic = id.toString().split('node_modules/')[1];
              const sub1 = basic.split('/')[0];
              if (sub1 !== '.pnpm') {
                return sub1.toString();
              }
              const name2 = basic.split('/')[1];
              const chunkNames = {
                '@tensorflow+tfjs-backend': 'tensorflow_tfjs_backend',
                '@tensorflow+tfjs-core': 'tensorflow_tfjs_core',
                '@tensorflow+tfjs': 'tensorflow_tfjs',
              };
              for (const prefix in chunkNames) {
                if (name2.startsWith(prefix)) {
                  return chunkNames[prefix];
                }
              }
              return name2.split('@')[name2[0] === '@' ? 1 : 0].toString();
            }
          },
        },
      },
      sourcemap: true,
    },
    define: {
      'process.env': {},
    },
    plugins: [
      mkcert(),
      react(),
      tsconfigPaths(),
      Unfonts({
        fontsource: {
          families: ['montserrat'],
        },
      }),
    ],
    server: {
      https: true,
      open: true,
      port: 3000,
    },
  };
});

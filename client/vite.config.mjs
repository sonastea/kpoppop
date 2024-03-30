import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';
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
              return name2.split('@')[name2[0] === '@' ? 1 : 0].toString();
            }
          },
        },
        plugins: [nodePolyfills()],
      },
      sourcemap: true,
    },
    define: {
      'process.env': {},
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
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
    resolve: {
      alias: {
        events: 'rollup-plugin-node-polyfills/polyfills/events',
        path: 'rollup-plugin-node-polyfills/polyfills/path',
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
      },
    },
    server: {
      https: true,
      open: true,
      port: 3000,
    },
  };
});

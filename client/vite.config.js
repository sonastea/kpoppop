import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import tsconfigPaths from 'vite-tsconfig-paths';
import Unfonts from 'unplugin-fonts/vite';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
      rollupOptions: {
        output: {
          manualChunks(id) {
            const bundles = ['tfjs', 'react-router-dom', 'react-social-icons'];
            if (bundles.some((bundle) => id.includes(bundle))) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
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

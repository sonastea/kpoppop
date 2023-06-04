import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
      rollupOptions: {
        plugins: [nodePolyfills()],
      },
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
    plugins: [basicSsl(), react(), tsconfigPaths()],
    resolve: {
      alias: {
        events: 'rollup-plugin-node-polyfills/polyfills/events',
        path: 'rollup-plugin-node-polyfills/polyfills/path',
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
      },
    },
    server: {
      hmr: {
        host: 'localhost',
        port: 3000,
        protocol: 'wss',
      },
      https: true,
      open: true,
      port: 3000,
    },
  };
});

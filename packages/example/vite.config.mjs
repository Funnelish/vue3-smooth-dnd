import { defineConfig, searchForWorkspaceRoot } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

const smoothDndRoot = fileURLToPath(new URL('../../../smooth-dnd', import.meta.url));

export default defineConfig({
  base: '/vue3-smooth-dnd/',
  plugins: [vue()],
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), smoothDndRoot]
    }
  }
});

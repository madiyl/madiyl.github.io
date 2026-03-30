import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  base: (() => {
    const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
    if (!repo) return './';
    const isUserOrOrgSite = repo.endsWith('.github.io');
    return isUserOrOrgSite ? '/' : `/${repo}/`;
  })(),
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths()
  ],
})

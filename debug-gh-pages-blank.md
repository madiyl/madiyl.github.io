# Debug Session: gh-pages-blank

Status: [OPEN]

## Symptom
- GitHub Pages 站点 `https://madiyl.github.io/` 打开空白。

## Expected
- 首页正常渲染（Header/Hero/Card Grid）。

## Hypotheses (falsifiable)
1. Pages 当前仍在托管源码（`index.html` 引用 `/src/main.tsx`），而不是托管构建产物 `dist/`。
2. GitHub Actions 未触发或未成功（分支不匹配、未启用 Actions Pages、权限/配置问题），导致 `dist/` 未发布。
3. 站点已发布 `dist/`，但 `base` 与实际路径不一致，导致 `/assets/*` 404，页面白屏。
4. 站点已发布且资源可加载，但运行时 JS 报错（路由/环境/浏览器兼容）导致白屏。

## Current Evidence
- 线上 HTML 包含 `<script type="module" src="/src/main.tsx"></script>` → 强指向 Hypothesis 1/2。
- GitHub Actions 部署失败提示 `Unable to locate executable file: pnpm`。

## Instrumentation Plan
- 在 `index.html` 中加入 `%VITE_BUILD_SHA%` 标识与 fallback 提示，用于快速判断“源码托管 vs dist 托管”。
- 在 GitHub Actions 构建步骤注入 `VITE_BUILD_SHA=${{ github.sha }}`，确保产物可被验证。

## Next Checks
- 再次抓取线上 HTML：是否仍引用 `/src/main.tsx` 或变为 `/assets/index-*.js`。
- 访问 `https://madiyl.github.io/` 源码中 `%VITE_BUILD_SHA%` 是否被替换为 commit SHA。
- Actions 重新运行后确认不再出现 `pnpm` 找不到，且 `Upload artifact`/`Deploy` 成功。

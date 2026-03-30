# Life & Tools Hub

一个极简高级的个人生活工具与攻略入口页（React + Vite + Tailwind）。

## 本地开发

```bash
pnpm install
pnpm run dev
```

## 构建与预览

```bash
pnpm run build
pnpm run preview
```

## 部署到 GitHub Pages

本仓库已内置 GitHub Actions 自动部署到 Pages。

1. GitHub 仓库设置 → `Settings` → `Pages`
2. `Build and deployment` 选择 `GitHub Actions`
3. 推送到 `main` 分支后会自动构建并发布（产物来自 `dist/`）

`vite.config.ts` 会根据仓库类型自动选择正确的 `base`：
- `xxx.github.io`（User/Org Pages）：`/`
- 其他仓库（Project Pages）：`/<repo>/`

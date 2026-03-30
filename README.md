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
3. 推送到 `master`（或 `main`）分支后会自动构建并发布（产物来自 `dist/`）

`vite.config.ts` 会根据仓库类型自动选择正确的 `base`：
- `xxx.github.io`（User/Org Pages）：`/`
- 其他仓库（Project Pages）：`/<repo>/`

## Supabase（可选）

站点默认使用本地配置渲染卡片；如果配置了 Supabase，则会优先从表 `hub_items` 读取。

### 1) 配置环境变量（本地）

复制 `.env.example` 为 `.env`，填入：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

注意：只把匿名公钥（anon/publishable）放到前端；不要把任何 secret key 放入仓库或前端代码。

### 2) 创建表并写入数据

在 Supabase Dashboard 的 SQL Editor 依次执行：
- `supabase/schema.sql`
- `supabase/seed.sql`

### 3) GitHub Pages 环境变量

在 GitHub 仓库 `Settings → Secrets and variables → Actions` 添加：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

部署工作流会在构建时注入这两个变量。

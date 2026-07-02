# 装修过程记录网页

这是一个部署在 `madiyl.github.io` 的单页装修记录网站，按装修顺序分为 5 个独立阶段：

1. 设计阶段
2. 主材选购
3. 电器选购
4. 施工流程
5. 软装选取

页面默认公开可读，文本和结构化内容支持在线编辑并保存到 Supabase；图片首版通过仓库静态资源路径录入。

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Supabase
- GitHub Pages

## 本地开发

```bash
npm install
npm run dev
```

## 环境变量

复制 `.env.example` 为 `.env`，并填写：

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
EDIT_PASSWORD=
```

说明：

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` 用于前端读取内容和调用 Edge Function
- `EDIT_PASSWORD` 用于 Supabase Edge Function 中校验编辑门禁

## Supabase 初始化

1. 在 Supabase 项目中执行 `supabase/schema.sql`
2. 部署 `supabase/functions/save-renovation-page/index.ts`
3. 为函数环境配置：
   - `EDIT_PASSWORD`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_URL`

## 图片录入约定

- 将图片放入仓库目录：`public/uploads/renovation/`
- 在网页编辑器中填写相对路径，例如：

```text
/uploads/renovation/design/floor-plan-01.jpg
```

## 发布到 GitHub Pages

仓库已包含 `.github/workflows/deploy.yml`。

需要在 GitHub 仓库 Secrets 中设置：

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

推送到 `master` 后将自动构建并发布到 GitHub Pages。

## 校验命令

```bash
npm run check
npm run test
npm run build
```

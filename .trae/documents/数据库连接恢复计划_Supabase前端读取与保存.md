# 数据库连接恢复计划_Supabase前端读取与保存

## Summary

本次目标是恢复当前项目的 Supabase 本地连接，使页面重新读取线上 `renovation_pages` 的 `content_json`，并同时确保保存链路可用。执行阶段将以根目录 `.env.local` 作为本地前端环境配置入口，补齐 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`，然后验证前端读取、Edge Function 调用与保存回写是否正常。

## Current State Analysis

### 已确认的现状

1. 前端 Supabase 客户端只依赖两个 Vite 环境变量：
   - [`src/lib/supabase.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/supabase.ts)
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. 当前项目根目录不存在 `.env.local`：
   - `/Users/bytedance/madiyl.github.io/.env.local`

3. 当前前端在未读到 Supabase 配置时，会直接回退到默认内容：
   - [`src/lib/contentApi.ts#L14-L23`](file:///Users/bytedance/madiyl.github.io/src/lib/contentApi.ts#L14-L23)
   - 返回 `deepCloneDefaultContent()`，并显示“尚未配置 Supabase，当前展示的是本地默认内容。”

4. 项目 README 已写明需要配置 Supabase 环境变量，但当前示例值为空：
   - [`README.md#L30-L52`](file:///Users/bytedance/madiyl.github.io/README.md#L30-L52)
   - [`/.env.example`](file:///Users/bytedance/madiyl.github.io/.env.example)

5. 当前仓库存在 Supabase 项目关联信息，linked project ref 为：
   - [`supabase/.temp/linked-project.json`](file:///Users/bytedance/madiyl.github.io/supabase/.temp/linked-project.json)
   - `tqklcuxfbanarvclytnn`

6. 保存链路通过 Supabase Edge Function `save-renovation-page` 实现，而不是前端直接写表：
   - [`src/lib/contentApi.ts#L82-L106`](file:///Users/bytedance/madiyl.github.io/src/lib/contentApi.ts#L82-L106)
   - [`supabase/functions/save-renovation-page/index.ts`](file:///Users/bytedance/madiyl.github.io/supabase/functions/save-renovation-page/index.ts)

7. Edge Function 运行时依赖服务端环境变量：
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `EDIT_PASSWORD`（当前函数代码里 `bypassPassword = true`，校验已旁路）

8. `.gitignore` 已忽略本地环境文件，因此这类配置不会随最近 commit 一起进入仓库：
   - [`/.gitignore`](file:///Users/bytedance/madiyl.github.io/.gitignore)
   - 包含 `.env`、`.env.*`、`*.local`

### 根因判断

当前“数据库访问失败”的直接原因不是最近业务代码回归，而是本地前端环境没有读到 Supabase 连接变量。由于 `.env.local` 缺失，`isSupabaseConfigured` 为 `false`，页面退回本地默认内容。  
保存链路是否也失败，取决于线上 Edge Function 的环境变量和部署状态，需在恢复前端连接后继续联调验证。

## Proposed Changes

### 1. 在根目录创建并使用 `.env.local`

**文件**
- `/Users/bytedance/madiyl.github.io/.env.local`

**改动内容**
- 写入：
  - `VITE_SUPABASE_URL=https://tqklcuxfbanarvclytnn.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=<用户提供的 anon key>`

**原因**
- 当前项目无 `.env.local`，前端无法初始化 Supabase client。
- 用户已明确希望本地配置落在 `.env.local`。

**执行方式**
- 使用已确认的 project ref `tqklcuxfbanarvclytnn` 生成 URL。
- 等用户在执行阶段提供 anon key 后写入 `.env.local`。
- 重启本地 Vite 开发服务，使 Vite 重新读取环境变量。

### 2. 校验前端读取链路

**文件/模块**
- [`src/lib/supabase.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/supabase.ts)
- [`src/lib/contentApi.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/contentApi.ts)
- [`src/hooks/useRenovationData.ts`](file:///Users/bytedance/madiyl.github.io/src/hooks/useRenovationData.ts)

**改动内容**
- 原则上不改业务代码，先验证现有读取链路在配置恢复后是否正常。

**原因**
- 当前读取逻辑本身清晰，先前问题来自配置缺失，而不是实现错误。

**验证目标**
- 页面不再显示“尚未配置 Supabase，当前展示的是本地默认内容。”
- `useRenovationData()` 成功加载线上 `content_json`
- 人员头像、人员名称等线上内容恢复显示

### 3. 校验保存链路与 Edge Function 可用性

**文件/模块**
- [`src/lib/contentApi.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/contentApi.ts)
- [`supabase/functions/save-renovation-page/index.ts`](file:///Users/bytedance/madiyl.github.io/supabase/functions/save-renovation-page/index.ts)
- [`supabase/config.toml`](file:///Users/bytedance/madiyl.github.io/supabase/config.toml)

**改动内容**
- 原则上先不改函数逻辑，先验证线上 `save-renovation-page` 是否可调用。
- 若读取恢复但保存失败，再定位是否为以下问题：
  - Edge Function 未部署到当前 linked project
  - 函数环境变量不完整（`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`）
  - 线上函数版本落后于仓库当前代码

**原因**
- 用户本次希望修复到“前端读取 + 保存”完整链路，不能只停在读取恢复。

**验证目标**
- 前端点击保存后，`saveRenovationPageData()` 返回成功
- `updatedAt` 更新
- 刷新页面后能读回刚保存的数据

### 4. 同步修正文档，避免后续继续误判

**文件**
- [`README.md`](file:///Users/bytedance/madiyl.github.io/README.md)
- [`/.env.example`](file:///Users/bytedance/madiyl.github.io/.env.example)

**改动内容**
- 将 README 的本地配置说明从“复制 `.env.example` 为 `.env`”调整为更贴近当前实际开发方式的 `.env.local`。
- 保留 `.env.example` 作为模板，但明确推荐本地开发优先使用 `.env.local`。

**原因**
- 当前 README 与用户实际使用期望不一致，容易造成“明明应该本地可用但前端读不到配置”的重复问题。

## Assumptions & Decisions

### 已锁定决策

1. 修复范围为“前端读取 + 保存”，不是只恢复读取。
2. 本地配置文件使用 `.env.local`。
3. `VITE_SUPABASE_URL` 将基于已确认的 Supabase project ref `tqklcuxfbanarvclytnn` 生成。
4. `VITE_SUPABASE_ANON_KEY` 由用户在执行阶段提供。

### 关键假设

1. 当前 Supabase 项目 `tqklcuxfbanarvclytnn` 仍然是本项目正在使用的线上项目。
2. 用户提供的 anon key 与该项目匹配，且具备读取 `renovation_pages` 与调用 `save-renovation-page` 的前端权限。
3. 线上 Edge Function 已部署，或如果未部署，用户接受将其纳入修复范围。

### 风险与边界

1. 如果用户只提供 anon key，但线上函数未部署或服务端环境变量缺失，读取会恢复，但保存仍可能失败。
2. 由于 `.env.local` 被 `.gitignore` 忽略，本次修复完成后仍不会进入 git；这是预期行为，不应视为丢失。
3. 当前执行环境可能缺少 `node/npm`，如果需要本地运行前端或构建验证，需确认本机 PATH 或运行方式。

## Verification Steps

1. 创建 `.env.local` 并写入：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. 重启本地开发服务，确认前端不再显示默认内容回退提示。

3. 打开页面后检查：
   - 人员介绍模块是否恢复线上头像/名称数据
   - 其他模块是否恢复线上实际内容，而不是默认示例

4. 进入编辑并执行一次保存：
   - 验证前端未报错
   - 验证 `updatedAt` 更新
   - 刷新后确认保存内容仍存在

5. 如果保存失败，继续分层排查：
   - Edge Function 是否部署
   - `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` 是否在线上函数环境中存在
   - 当前 linked project 是否与前端 URL 指向同一 Supabase 项目

6. 更新 README 和 `.env.example`，明确本地推荐配置方式，降低后续重复故障概率。

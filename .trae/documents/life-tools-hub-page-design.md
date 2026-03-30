# Life & Tools Hub — Page Design Spec（Desktop-first）

## Global Styles（Design Tokens）
- Layout width: 内容最大宽度 1120–1200px，左右 padding 24px（桌面）。
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64。
- Typography:
  - H1: 44–52px / 1.1 / 600
  - H2: 24–28px / 1.2 / 600
  - Body: 14–16px / 1.6 / 400
  - Small: 12–13px / 1.4 / 400
- Colors（建议用 CSS Variables + Tailwind 暗色模式）：
  - Background: light #0B0C0F 的反转版本（如 #FFFFFF 或 #F7F7F8），dark #0B0C0F
  - Surface(Card): light #FFFFFF，dark #111318
  - Text primary: light #0B0C0F，dark #F4F5F6
  - Text secondary: light #5B5F66，dark #A6ABB3
  - Border: light rgba(11,12,15,0.08)，dark rgba(244,245,246,0.10)
  - Accent: 低饱和冷色（如 #7AA2FF）用于点缀与 focus ring
- Card style: 12–16px 圆角；1px 边框；hover 提升阴影与边框对比；过渡 180–220ms ease。
- Focus/Accessibility: 所有可点击卡片与按钮提供清晰 focus ring；外链提示（可选：aria-label）。

---

## Page 1：门户导航页（首页）

### Layout
- 桌面优先：整体为“纵向堆叠 sections”。
- 使用 Flexbox + CSS Grid 混合：
  - Header 使用 Flex（左右对齐）。
  - 卡片区使用 Grid（自适应列数）。
- Responsive（建议断点）：
  - ≥1024px：卡片 3–4 列（推荐 4 列），Hero 左对齐。
  - 640–1023px：卡片 2–3 列。
  - <640px：卡片 1 列；Header 元素收敛间距。

### Meta Information
- Title: Life & Tools Hub
- Description: 你的极简生活与效率工具入口。
- Open Graph:
  - og:title = Life & Tools Hub
  - og:description = 你的极简生活与效率工具入口。
  - og:type = website

### Page Structure
1. Header（顶部导航）
2. Hero（首屏标题 + 动效）
3. Card Grid（工具导航卡片网格）
4. Footer（弱化信息区）

### Sections & Components

#### 1) Header
- 结构：
  - Left：站点名（Life & Tools Hub）/ 小型 Logo（可选）。
  - Right：主题切换按钮（IconButton）。
- 交互：
  - 点击切换 light/dark。
  - 默认策略：优先读本地存储；无则跟随系统 prefers-color-scheme。
- 视觉：
  - 高度 64px；底部 1px 分割线（低对比）。
  - 主题切换按钮 hover 有轻微背景（surface/10%）。

#### 2) Hero
- 内容：
  - H1：Life & Tools Hub
  - Subtitle：一句话说明（例如“把常用工具放在一个干净的入口里”）。
- 动效（轻量高级感）：
  - 首次进入：标题与副标题做 12–16px 上移 + 淡入。
  - 背景装饰：柔和渐变光晕/噪点纹理（静态或慢速漂移）。
  - 注意：动效可被“减少动态效果”偏好关闭（prefers-reduced-motion）。

#### 3) Card Grid（核心）
- 数据来源：前端本地配置（JSON/TS），字段建议：
  - title, description, href, icon(optional), group(optional), order
- 布局：
  - Section 标题（可选）：如“Tools / Life / Work”（若你后续有分组需求）。
  - Grid：gap 16–20px；卡片最小宽 240–260px。
- 卡片结构：
  - 顶部：图标（可选） + 标题。
  - 中部：描述（2 行截断）。
  - 右下：外链指示（可选）。
- 交互态：
  - hover：边框加深 + 轻阴影 + 微小上浮（1–2px）。
  - active：轻微回弹。
  - 点击：整张卡片可点；外链新标签打开（target=_blank, rel=noopener noreferrer）。

#### 4) Footer
- 内容：
  - 版权/作者（可选）
  - GitHub 仓库链接（可选）
- 视觉：
  - 文本使用 secondary 色；与主内容保持 48–64px 间距。

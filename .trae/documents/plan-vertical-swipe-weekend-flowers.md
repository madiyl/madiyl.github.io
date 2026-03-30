# 计划：北京周末赏花攻略由横滑改为竖滑（iPhone/微信内置浏览器兼容）

## Summary（目标与交付）
- 将 [weekend-flowers.html](file:///Users/bytedance/madiyl.github.io/public/tools/weekend-flowers.html) 从“横向翻页”改为“竖向翻页”，在 iPhone Safari 与微信内置浏览器里滑动丝滑、不卡顿。
- 交互要求：一页一页翻（分页滚动/吸附到整页），并且每一页都有“花的入场动效”（进入当前页时触发）。
- 保留现有内容结构（左图右文、右侧内容可滚动阅读）并尽量不引入额外依赖（纯 HTML/CSS/JS）。

## Current State Analysis（基于现状的事实）
- 当前页面是“横向滚动容器 + 全屏页面卡片”：
  - CSS 里已经从 `html/body` 横向滚动改为 `#hScroller` 横向滚动容器，并使用 `scroll-snap-type:x mandatory`。
  - JS 通过 `scrollTo({left: idx * pageWidth()})` 翻页，并用 `IntersectionObserver({ root: scroller })` 更新右侧圆点/页码。
  - 右侧内容面板 `.page-content` 仍是独立 `overflow-y:auto`（用于在单页内阅读长内容）。
- 现有横滑在移动端的关键技术点：
  - `touchmove` 使用 `{ passive:false }` 并在判定横向手势后 `preventDefault()`，避免与纵向滚动冲突。
  - 翻页用速度阈值 + 吸附目标页。
- 竖滑改造的最大风险点：
  - 页面整体竖向翻页与 `.page-content` 的竖向阅读滚动会产生手势冲突（尤其 iOS/微信 WebView）。

## 关键设计决策（本计划默认选择）
1. **分页容器改为竖向 `#vScroller`**：页面整体只在 `#vScroller` 内竖向滚动，`html/body` 固定 `overflow:hidden`，减少 iOS 根滚动兼容坑。
2. **“一页一页”的实现方式：优先用原生 scroll-snap + 辅助分页吸附**：
   - CSS：`scroll-snap-type: y mandatory` + `scroll-snap-stop: always`（支持时更像“一页一停”）。
   - JS：增加触控分页逻辑（拖拽/速度阈值/吸附），确保在 iOS/微信里体验稳定。
3. **与内容阅读滚动的冲突处理（默认策略）**：
   - 手指落在 `.page-content` 内时：优先让内容区正常上下滚动阅读。
   - 仅当内容区已滚到顶部且继续下拉、或已滚到底部且继续上拉时，再触发“翻页”（即“边界穿透翻页”）。
   - 手指落在左侧图片区或页面空白区域：直接触发翻页。
4. **入场动效触发点**：沿用现有 `IntersectionObserver` 给当前页加 `.active`，用 CSS transition/keyframes 实现“花元素入场”（例如 emoji 弹入、标题/标签淡入上移、图片轻微缩放/对焦）。

## Proposed Changes（具体改哪些文件，怎么改）

### 1) 改造竖向分页容器与布局（HTML/CSS）
文件： [weekend-flowers.html](file:///Users/bytedance/madiyl.github.io/public/tools/weekend-flowers.html)
- 将 `#hScroller` 改为 `#vScroller`：
  - `display:flex` 改为 `display:block`（或 `flex-direction:column`），改为 `overflow-y:auto; overflow-x:hidden;`
  - `scroll-snap-type` 改为 `y mandatory`
  - 增加 `scroll-snap-stop: always`（支持时更强制“一页一页”）
  - 保留 `-webkit-overflow-scrolling: touch`，并隐藏滚动条
- 每一页 section 维持 `height: 100dvh`（保留 `100vh` 兜底），`scroll-snap-align:start`
- 仅在页面内部容器滚动，`html/body` 禁止整体滚动（`overflow:hidden`）

### 2) 竖向翻页逻辑（JS）
文件： [weekend-flowers.html](file:///Users/bytedance/madiyl.github.io/public/tools/weekend-flowers.html)
- 将翻页 API 从 `scrollLeft` 替换为 `scrollTop`：
  - `pageHeight()` = `vScroller.clientHeight || window.innerHeight`
  - `scrollToPage(idx)` = `vScroller.scrollTo({ top: idx * pageHeight(), behavior })`
- `IntersectionObserver`：
  - `root` 仍设为 `vScroller`，阈值保留 `0.5`
  - 更新页码/右侧圆点逻辑保持
- 触控分页（重点兼容 iPhone/微信）：
  - `touchstart/touchmove/touchend` 监听绑定到 `vScroller`
  - 手势锁定：当 `|dy|` 明显大于 `|dx|` 时认定竖向翻页手势
  - 若落点在 `.page-content`：
    - 默认不接管；只有当内容区在顶部/底部并继续往外滑时，才切换为翻页（并 `preventDefault`）
  - `touchend` 根据位移 + 速度阈值计算目标页，调用 `scrollToPage` 吸附
- 键盘翻页：
  - 桌面支持 `ArrowDown/ArrowUp` 翻页，`Home` 回首页

### 3) “每页花的入场动效”（CSS + active class）
文件： [weekend-flowers.html](file:///Users/bytedance/madiyl.github.io/public/tools/weekend-flowers.html)
- 为每页的“花元素”定义入场动画（无第三方库）：
  - `.img-bottom .flower-emoji`：缩放 + 轻弹（keyframes）
  - `.img-bottom h1`、`.flower-lang span`：淡入 + 上移（transition）
  - `.page-image img`：沿用现有 scale 对焦，确保在 `.active` 切换时触发
- 动效触发：页进入时 `IntersectionObserver` 添加 `.active`（已存在），只需扩展 CSS
- 降低卡顿风险：
  - 动效尽量使用 `transform/opacity`（GPU 友好）
  - 为动画元素加 `will-change: transform, opacity`（谨慎使用在少量元素上）

## Assumptions & Decisions（假设）
- 仍保留 `.page-content` 的内部滚动阅读能力（因为单页内容较长，移动端必须可读）。
- “一页一页”定义为：滑动后最终停在整页起始位置（scroll-snap/吸附），而不是连续自由滚动。
- 翻页触发区域为“全屏可翻页”，但会对 `.page-content` 内部阅读滚动做优先级保护（只在边界穿透时翻页）。

## Verification（如何验证完成）
### 本地验证
- 运行本地开发服务后打开：`/tools/weekend-flowers.html`
- 验证点：
  - 竖向滑动时可以分页停靠到整页（不会停在半页）
  - 在 `.page-content` 内上下滑可阅读；到顶部/底部继续滑能翻页（符合默认策略）
  - 右侧圆点/页码随页更新正确
  - 每页进入时花 emoji/标题/图片动效触发，且无明显掉帧

### 真机/微信验证（关键）
- iPhone Safari：
  - 快速连滑翻页不卡顿；不会出现整页“抖动回弹”导致停不稳
- iPhone 微信内置浏览器：
  - 翻页手势可用；内容区滚动可用；不会被微信的下拉回弹劫持导致无法翻页

## Out of Scope（不做）
- 不接入 React/Framer Motion 重写该静态攻略页（保持为纯静态 HTML）。
- 不新增后台编辑/实时发布等能力（只改交互与动效）。

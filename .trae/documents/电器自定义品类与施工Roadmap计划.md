# 电器自定义品类与施工Roadmap计划

## Summary

本次改动包含两个目标：

1. 在“电器选购”编辑态支持新增任意自定义电器品类，并允许删除这些自定义品类；现有固定品类继续保留。
2. 在“施工流程”模块最上方增加一条轻量横向 roadmap，阶段名称采用你提供的计划表口径，但实现上尽量复用现有施工节点与 `plannedAt/status` 数据，不引入截图那种完整表格式计划数据。

整体策略是：

- **电器**：从“固定枚举驱动的卡片列表”改成“固定品类 + 自定义品类并存”的渲染方式。
- **施工**：在不重建数据模型的前提下，从现有 `construction` 节点中派生出上方的大阶段 roadmap。

## Current State Analysis

### 1. 电器模块当前是固定枚举驱动，无法新增任意品类

- 文件：[`src/components/stages/AppliancesStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/AppliancesStage.tsx)
- 现状：
  - 顶部存在固定常量 `categories: ApplianceCategory[]`
  - 页面主体使用 `categories.map(...)` 渲染卡片
  - 若某个固定品类不存在对应数据，则编辑态只显示“新增条目”按钮
  - 新增逻辑会创建一条 `category` 固定为该枚举值的 `ApplianceItem`

这意味着当前只能在预设的 6 个品类里补条目，不能新增任意“其它电器”。

### 2. `ApplianceCategory` 当前是联合类型，不适合承载自定义分类

- 文件：[`src/types/renovation.ts`](file:///Users/bytedance/madiyl.github.io/src/types/renovation.ts)
- 当前定义：
  - `ApplianceCategory = "电视" | "冰箱" | "洗烘套装" | "洗碗机" | "烟灶套装" | "燃气热水器"`
- `ApplianceItem.category` 直接使用该类型

这会导致任意新分类在类型层无法通过，也会把组件和默认内容都锁死在固定值里。

### 3. 默认内容与数据合并逻辑当前允许“非严格枚举值”流过，但没有正式支持自定义分类

- 文件：[`src/lib/defaultContent.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/defaultContent.ts)
- 现状：
  - `defaultContent.appliances` 由固定 `applianceCategories.map(...)` 生成
  - `mergeWithDefaultContent()` 对 `partial.appliances` 的处理是直接保留条目，仅对旧的 `油烟机 -> 烟灶套装` 做兼容映射
  - 说明当前运行时并不会主动过滤掉未知 `category`，但类型系统仍不正式支持

这给了我们一个较平滑的改造空间：只要把类型和渲染方式改通，自定义分类不需要额外的持久化迁移。

### 4. 施工模块当前只有工序卡片，没有顶部 roadmap

- 文件：[`src/components/stages/ConstructionStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/ConstructionStage.tsx)
- 当前结构：
  - 固定 `phases: ConstructionPhase[]`
  - 每个工序卡片展示 `status / plannedAt / progress / detail / risk`
  - 组件顶部只有 `SectionHeader`，没有任何阶段总览

### 5. 施工数据当前只有单层节点，不足以直接复刻截图计划表

- 文件：[`src/types/renovation.ts`](file:///Users/bytedance/madiyl.github.io/src/types/renovation.ts)
- `ConstructionTask` 目前字段只有：
  - `phase`
  - `status`
  - `plannedAt`
  - `progress`
  - `detail`
  - `risk`

- 文件：[`src/lib/defaultContent.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/defaultContent.ts)
- 默认施工数据也只有：
  - 工序节点
  - 简单 `plannedAt`
  - 当前进度文案

因此如果要做成截图那样的“开始时间 / 结束时间 / 工期 / 主材采购明细”的完整计划表，必须新增一整层计划数据结构。当前已明确本轮不走这条路，而是先做“轻量横向路线图”。

## Proposed Changes

### 1. 把 `ApplianceCategory` 从固定联合类型改为可扩展字符串，并保留固定品类常量

**文件：**
- 修改：[`src/types/renovation.ts`](file:///Users/bytedance/madiyl.github.io/src/types/renovation.ts)
- 修改：[`src/lib/defaultContent.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/defaultContent.ts)
- 修改：[`src/components/stages/AppliancesStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/AppliancesStage.tsx)

**做法：**
- 将 `ApplianceCategory` 调整为 `string`，或者拆成：
  - `BuiltInApplianceCategory`：保留现有联合类型
  - `ApplianceCategory = BuiltInApplianceCategory | string`
- 在组件和默认内容中保留一份“固定品类常量列表”，继续用于预设卡片展示顺序

**原因：**
- 这是支持“无限自定义”的最低成本方式。
- 运行时与保存逻辑基本不需要额外迁移，只要类型系统放开即可。

### 2. 电器模块改为“固定品类卡片 + 自定义品类卡片”双区渲染

**文件：**
- 修改：[`src/components/stages/AppliancesStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/AppliancesStage.tsx)

**做法：**
- 保留当前固定品类区：
  - 继续按既定顺序展示 `电视 / 冰箱 / 洗烘套装 / 洗碗机 / 烟灶套装 / 燃气热水器`
  - 若该固定品类没有对应条目，编辑态仍可点击“新增条目”
- 在固定品类区之后，追加“自定义电器”区：
  - 渲染所有 `category` 不在固定品类列表中的 `ApplianceItem`
  - 每张卡片仍复用现有卡片结构
  - 编辑态允许删除
- 在编辑态顶部或自定义区头部增加“新增其它电器”按钮：
  - 创建新条目时，默认值为：
    - `category: ""`
    - `brandModel: ""`
    - `channel: "电商平台"`
    - `status: "选品"`
    - 其他字段沿用当前默认值

**原因：**
- 这样可以尽量保留当前已打磨好的固定品类体验。
- 自定义品类不会干扰固定品类，也无需重写整个卡片逻辑。

### 3. 自定义电器条目支持编辑品类名称与删除；固定品类不可删除

**文件：**
- 修改：[`src/components/stages/AppliancesStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/AppliancesStage.tsx)

**做法：**
- 对固定品类条目：
  - 分类标题继续只读展示
  - 不提供删除按钮
- 对自定义品类条目：
  - 编辑态在卡片头部提供“电器品类”输入框，替代固定标题
  - 浏览态标题显示用户填写的品类名；为空时显示 `待命名电器`
  - 提供“删除条目”按钮，仅对自定义卡片显示
- 默认排序：
  - 固定品类始终在前
  - 自定义品类按当前数组顺序展示

**原因：**
- 这正好对应你确认的产品口径：`可新增可删除`，但不做排序功能。

### 4. 施工模块顶部新增“按截图大阶段口径”的轻量 roadmap

**文件：**
- 修改：[`src/components/stages/ConstructionStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/ConstructionStage.tsx)

**做法：**
- 在 `SectionHeader` 下、工序卡片列表上方增加一个横向 roadmap 区块
- roadmap 的阶段口径采用大阶段，而不是现有单个工序节点：
  - `前期工程`
  - `水电阶段`
  - `泥工阶段`
  - `木工阶段`
  - `腻子墙漆`
  - `安装收尾`
  - `家具入住`
- 每个大阶段由组件内映射到当前 `ConstructionPhase`：
  - `前期工程` -> `成品保护`、`拆除`、`新建`
  - `水电阶段` -> `水电`
  - `泥工阶段` -> `地面`
  - `木工阶段` -> `顶面`
  - `腻子墙漆` -> `墙面`
  - `安装收尾` -> `成品安装`
  - `家具入住` -> 无现成 phase，对应一个纯展示占位阶段
- 每个大阶段显示：
  - 阶段名
  - 聚合状态（从映射到的工序节点推导）
  - 一条简短的时间提示（优先使用映射节点里的 `plannedAt`）

**原因：**
- 这样既能接近你给的计划表阅读方式，又不需要新建复杂 schema。
- `家具入住` 作为计划末端阶段，当前可先作为展示型节点，不强制与数据层绑定。

### 5. 为 roadmap 增加明确的状态聚合规则，避免执行时临时拍脑袋

**文件：**
- 修改：[`src/components/stages/ConstructionStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/ConstructionStage.tsx)

**做法：**
- 在组件内部定义 `getRoadmapStageStatus()`：
  - 若映射节点全部为 `已完成` -> 大阶段为 `已完成`
  - 若任一节点为 `进行中` -> 大阶段为 `进行中`
  - 若存在 `待复查` 且没有 `进行中` -> 大阶段为 `待复查`
  - 若所有节点都 `未开始` 或不存在 -> 大阶段为 `未开始`
- `家具入住` 阶段：
  - 若 `成品安装` 为 `已完成`，则显示 `未开始`
  - 否则同样显示 `未开始`
  - 本轮不尝试自动推导“入住中/已入住”

**原因：**
- 这样 roadmap 的状态行为稳定、可解释，也不需要额外字段。

### 6. 用测试锁定两类关键兼容行为

**文件：**
- 修改：[`src/lib/defaultContent.test.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/defaultContent.test.ts)
- 新建或补充：`src/components/stages/ConstructionStage.test.tsx`（当前项目中不存在该测试文件）

**做法：**
- `defaultContent.test.ts` 增加一条自定义电器分类兼容测试：
  - 输入一条 `category: "投影仪"` 的 appliance 数据
  - 断言 `mergeWithDefaultContent()` 后该分类仍然保留
- `ConstructionStage` 增加一条 roadmap 渲染测试：
  - 传入包含 `成品保护/拆除/新建/水电/...` 的施工数据
  - 断言页面渲染出 `前期工程 / 水电阶段 / 泥工阶段` 等大阶段名
  - 断言聚合状态至少能正确出现 `已完成` 或 `进行中`

**原因：**
- 自定义电器是这次最容易被未来枚举逻辑误伤的点。
- roadmap 的核心价值在于“口径映射 + 状态聚合”，适合用轻量测试锁住。

## Assumptions & Decisions

1. **电器分类采用“固定品类 + 自定义品类并存”模式。**
   - 固定品类仍保留当前体验。
   - 自定义品类只对新增卡片开放编辑和删除。

2. **本轮不实现自定义电器排序。**
   - 自定义条目按数组顺序显示，默认排在固定品类后面。

3. **施工 roadmap 采用截图里的大阶段名称，但不复刻截图式完整计划表。**
   - 只做轻量横向总览，不新增“开始/结束/工期/主材采购明细”等字段。

4. **roadmap 主要从现有 `construction` 数据派生。**
   - 这意味着时间提示仍受当前 `plannedAt` 粒度限制，先不追求精确到具体起止日期。

5. **`家具入住` 作为展示型末端阶段先独立存在。**
   - 当前数据层没有与之严格对应的 `ConstructionPhase`，本轮不新增 schema。

## Verification Steps

1. 检查电器模块：
   - 编辑态能新增一张自定义电器卡片
   - 自定义卡片可以填写品类名称
   - 自定义卡片可以删除
   - 固定品类卡片仍按原顺序展示，不受自定义卡片影响

2. 检查施工模块：
   - `SectionHeader` 下方出现横向 roadmap
   - roadmap 阶段名为：
     - `前期工程`
     - `水电阶段`
     - `泥工阶段`
     - `木工阶段`
     - `腻子墙漆`
     - `安装收尾`
     - `家具入住`
   - roadmap 状态能随现有施工节点的 `status` 变化而变化

3. 运行测试与校验：

```bash
npm run test -- src/lib/defaultContent.test.ts src/components/stages/ConstructionStage.test.tsx
npm run check
npm run lint
npm run build
```

4. 人工回归：
   - 旧数据中的 `油烟机` 仍能兼容到 `烟灶套装`
   - 新增的自定义电器刷新后仍可保留
   - 施工 roadmap 不会挤压现有施工卡片内容区，手机端仍可读

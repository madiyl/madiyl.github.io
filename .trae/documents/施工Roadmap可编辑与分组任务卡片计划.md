# 施工Roadmap可编辑与分组任务卡片计划

## Summary

本次改动聚焦施工模块的结构升级，目标有两个：

1. roadmap 不再只是顶部派生展示，而是进入可编辑状态，支持维护每个大阶段的 `排期` 和 `估时`。
2. 下方的施工内容不再按当前 8 个固定工序平铺，而是改成“按 roadmap 大阶段分组”的任务卡片结构，更方便记录每个阶段下的任务、状态、时间和进度。

本轮方案采用：

- **roadmap 独立数据层**
- **大阶段分组 + 预置步骤 + 可增删**
- **兼容旧 `construction` 扁平数组，自动迁移到新结构**

## Current State Analysis

### 1. roadmap 当前只是派生展示，没有自己的可编辑字段

- 文件：[`src/components/stages/ConstructionStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/ConstructionStage.tsx)
- 现状：
  - roadmap 由组件内 `roadmapStages` 和现有 `construction` 节点动态派生
  - roadmap 当前只显示：
    - 阶段名
    - 聚合状态
    - 从 `plannedAt` 派生的一条时间提示
  - 没有独立的 `排期` / `估时` 字段，也没有编辑入口

因此要让 roadmap 可编辑，不能继续只靠现有 `ConstructionTask[]` 派生，必须新增独立的 roadmap 数据层。

### 2. 下方施工内容当前是“固定工序卡片平铺”，不符合“按 roadmap 来”的新要求

- 文件：[`src/components/stages/ConstructionStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/ConstructionStage.tsx)
- 当前结构：
  - 固定 `phases: ConstructionPhase[]`
  - 页面直接按 `成品保护 / 拆除 / 新建 / 地面 / 顶面 / 墙面 / 水电 / 成品安装` 渲染卡片
  - 每张卡片只能记录：
    - `status`
    - `plannedAt`
    - `progress`
    - `detail`
    - `risk`

这更像“工序日志”，不适合承载“一个大阶段下面有多条具体任务”的结构。

### 3. `ConstructionTask` 当前字段不足以表达“阶段 -> 任务”的双层结构

- 文件：[`src/types/renovation.ts`](file:///Users/bytedance/madiyl.github.io/src/types/renovation.ts)
- 当前 `ConstructionTask` 只有：
  - `phase`
  - `status`
  - `plannedAt`
  - `progress`
  - `detail`
  - `risk`

没有：
  - roadmap 阶段 id
  - 大阶段自己的排期/估时
  - 任务标题
  - 任务级别的时间字段

如果继续复用当前类型，只能在一个字段里塞很多含义，后续会非常难维护。

### 4. 默认内容和合并逻辑当前仍是旧版扁平施工数组

- 文件：[`src/lib/defaultContent.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/defaultContent.ts)
- 现状：
  - `defaultContent.construction` 仍是 `ConstructionTask[]`
  - `mergeWithDefaultContent()` 对 `construction` 的处理是：
    - 有数据就直接使用 `partial.construction`
    - 没有数据就回退到默认值
  - 当前没有任何“旧结构 -> 新结构”的迁移逻辑

因此本轮如果直接改渲染而不改 merge，老数据会在刷新后丢失结构映射。

### 5. 当前已有一条 roadmap 测试，但它基于旧扁平结构

- 文件：[`src/components/stages/ConstructionStage.test.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/ConstructionStage.test.tsx)
- 现状：
  - 当前测试只验证：
    - roadmap 阶段名渲染
    - 聚合状态展示
  - 输入仍是旧的 `ConstructionTask[]`

这说明本轮改造必须同步更新测试口径，不能只改组件。

## Proposed Changes

### 1. 为施工模块新增“roadmap 阶段 + 阶段任务”双层数据结构

**文件：**
- 修改：[`src/types/renovation.ts`](file:///Users/bytedance/madiyl.github.io/src/types/renovation.ts)

**做法：**
- 保留现有 `ConstructionStatus`
- 新增：
  - `ConstructionRoadmapStageKey`
  - `ConstructionRoadmapStage`
  - `ConstructionStageTask`
- 推荐结构：

```ts
type ConstructionRoadmapStageKey =
  | "prep"
  | "water"
  | "tile"
  | "wood"
  | "paint"
  | "install"
  | "furniture";

type ConstructionStageTask = {
  id: string;
  title: string;
  status: ConstructionStatus;
  schedule: string;
  progress: string;
  detail: string;
  risk: string;
};

type ConstructionRoadmapStage = {
  id: ConstructionRoadmapStageKey;
  label: string;
  schedule: string;
  estimate: string;
  tasks: ConstructionStageTask[];
};
```

- `RenovationPageData` 中的 `construction` 从旧的 `ConstructionTask[]` 改为 `ConstructionRoadmapStage[]`

**原因：**
- 这能把“阶段计划”和“阶段下任务”拆清楚。
- 也更符合你确认的产品口径：roadmap 独立字段、下方按大阶段分组。

### 2. 在默认内容中预置每个大阶段及其默认步骤，并允许后续增删

**文件：**
- 修改：[`src/lib/defaultContent.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/defaultContent.ts)

**做法：**
- 用固定的 7 个大阶段初始化 `defaultContent.construction`
- 每个大阶段预置一组步骤，口径参考你的计划表，但保持轻量：
  - `前期工程`
    - 成品保护
    - 拆除交底
    - 新建放样
  - `水电阶段`
    - 水电交底
    - 水电施工
    - 水电验收
  - `泥工阶段`
    - 防水找平
    - 铺贴施工
    - 泥工验收
  - `木工阶段`
    - 吊顶基层
    - 柜体复尺
  - `腻子墙漆`
    - 墙顶找平
    - 打磨刷漆
  - `安装收尾`
    - 开关灯具安装
    - 成品安装
    - 收尾复查
  - `家具入住`
    - 家具进场
    - 开荒保洁

- 每个大阶段自带：
  - `schedule`
  - `estimate`
  - `tasks`

**原因：**
- 这满足“预置步骤 + 可增删”的需求。
- 默认内容给出起点，后续你编辑起来会轻很多。

### 3. 在 merge 逻辑中兼容旧 `ConstructionTask[]`，迁移到新结构

**文件：**
- 修改：[`src/lib/defaultContent.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/defaultContent.ts)
- 修改：[`src/lib/defaultContent.test.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/defaultContent.test.ts)

**做法：**
- 在 `mergeWithDefaultContent()` 中新增施工兼容逻辑：
  - 若 `partial.construction` 已是新结构，则按新结构合并
  - 若检测到旧结构（数组元素含 `phase` 字段），则按映射规则迁移到大阶段
- 旧 `phase -> 大阶段` 的映射规则：
  - `成品保护/拆除/新建` -> `前期工程`
  - `水电` -> `水电阶段`
  - `地面` -> `泥工阶段`
  - `顶面` -> `木工阶段`
  - `墙面` -> `腻子墙漆`
  - `成品安装` -> `安装收尾`
- 迁移策略：
  - 旧 `plannedAt` -> 新任务的 `schedule`
  - 旧 `progress/detail/risk` 原样映射到任务字段
  - roadmap 层的 `schedule/estimate` 若旧数据无法推导，则保留默认值或留空

**原因：**
- 当前已有线上/本地旧数据，不能要求你手动重录施工信息。
- 迁移只做一层最小可解释映射，避免过度推断。

### 4. 重写 `ConstructionStage.tsx`：roadmap 顶部可编辑，下方按大阶段分组展示任务卡片

**文件：**
- 修改：[`src/components/stages/ConstructionStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/ConstructionStage.tsx)

**做法：**
- 顶部 roadmap 区：
  - 浏览态显示：
    - 阶段名
    - 聚合状态（由该阶段任务聚合）
    - `排期`
    - `估时`
  - 编辑态允许直接编辑：
    - `排期`
    - `估时`
- 下方内容区：
  - 按 roadmap 大阶段顺序渲染 7 个 section
  - 每个 section 头部显示：
    - 阶段名
    - 聚合状态
    - 当前排期 / 估时摘要
  - section 内渲染任务卡片列表

**原因：**
- 这样视觉和信息结构是一致的：上面是总览，下面是该阶段的具体任务。

### 5. 任务卡片改成更适合施工记录的字段布局

**文件：**
- 修改：[`src/components/stages/ConstructionStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/ConstructionStage.tsx)

**做法：**
- 每个任务卡片包含：
  - `任务名称`
  - `状态`
  - `时间`
  - `实际进度`
  - `关键细节`
  - `风险 / 待办`
- 布局改为更适合快速录入：
  - 第一行：任务名称 + 状态
  - 第二行：时间
  - 第三、四行：进度 / 细节 / 风险
- 编辑态支持：
  - 新增任务
  - 删除任务
  - 修改任务名称
- 浏览态：
  - 空字段隐藏，但核心字段（任务名 / 状态 / 时间）保留基本骨架

**原因：**
- 当前单卡更像通用表单，不够适合施工中的任务记录。
- 施工记录最常用的是“任务是什么、现在到哪了、什么时候做、卡在哪里”。

### 6. 状态聚合规则从“节点聚合”改为“阶段下任务聚合”

**文件：**
- 修改：[`src/components/stages/ConstructionStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/ConstructionStage.tsx)

**做法：**
- roadmap 和阶段头部的状态统一由该阶段的 `tasks` 聚合：
  - 任一任务 `进行中` -> 阶段 `进行中`
  - 所有任务 `已完成` -> 阶段 `已完成`
  - 若无 `进行中`，但存在 `待复查` -> 阶段 `待复查`
  - 其他情况 -> `未开始`

**原因：**
- 状态来源统一，避免 roadmap 和下方阶段头部出现不一致。

### 7. 更新测试口径，覆盖迁移、roadmap 编辑字段和阶段分组渲染

**文件：**
- 修改：[`src/lib/defaultContent.test.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/defaultContent.test.ts)
- 修改：[`src/components/stages/ConstructionStage.test.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/ConstructionStage.test.tsx)

**做法：**
- `defaultContent.test.ts`
  - 新增一条旧施工数据迁移测试：
    - 输入旧 `ConstructionTask[]`
    - 断言合并后变成大阶段结构
    - 断言旧的 `新建/水电/...` 内容被归到正确阶段
- `ConstructionStage.test.tsx`
  - 更新输入为新结构
  - 断言 roadmap 渲染出：
    - 阶段名
    - `排期`
    - `估时`
  - 断言下方内容按阶段分组渲染
  - 断言任务标题可见

**原因：**
- 这次改动本质上是施工模块的数据结构升级，必须让测试锁住兼容和新 UI 结构。

## Assumptions & Decisions

1. **roadmap 使用独立可编辑字段。**
   - `排期` 和 `估时` 存在 roadmap 阶段层，不从任务自动反推。

2. **施工内容改成“大阶段 -> 任务列表”结构。**
   - 不再继续以旧的 8 个固定工序卡片作为主视图。

3. **每个大阶段默认带预置步骤，但允许后续新增和删除。**
   - 默认步骤只是起点，不是强约束。

4. **旧施工数据必须兼容迁移。**
   - 执行时不能要求你手工重录之前的施工记录。

5. **本轮不做 roadmap 与任务时间的自动双向联动。**
   - roadmap 的 `排期/估时` 由你单独维护。
   - 任务卡片里的时间用于记录具体任务安排。

## Verification Steps

1. 数据兼容：
   - 旧 `construction` 扁平数组数据加载后不会丢失
   - 能正确迁移到新的大阶段结构

2. roadmap 编辑：
   - 编辑态可修改每个大阶段的 `排期`
   - 编辑态可修改每个大阶段的 `估时`
   - 浏览态能清晰显示这两个字段

3. 阶段分组与任务录入：
   - 下方按 roadmap 顺序渲染 7 个大阶段
   - 每个阶段默认带预置任务
   - 可新增任务
   - 可删除任务
   - 任务卡片可记录：
     - 任务
     - 状态
     - 时间
     - 进度
     - 关键细节
     - 风险 / 待办

4. 运行校验：

```bash
npm run test -- src/lib/defaultContent.test.ts src/components/stages/ConstructionStage.test.tsx
npm run check
npm run lint
npm run build
```

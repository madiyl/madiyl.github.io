# 施工卡片字段与 PDF 预览优化计划

## Summary

本次优化只针对 **主材选购阶段中 `category = 施工` 的卡片**，不影响其它主材类别。

目标有两项：

1. 删除施工卡片中的“最终选品”字段
2. 将“备注”扩展为“备注 + PDF 附件”，支持点击后在页面内弹窗预览 PDF

用户已明确偏好：

- 生效范围：**仅施工分类**
- 备注处理：**备注 + PDF 并存**
- PDF 预览方式：**弹窗内嵌预览**

---

## Current State Analysis

### 1. 当前卡片实现位置

- [`src/components/stages/MaterialsStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/MaterialsStage.tsx)

当前 `主材选购` 所有类别共用同一套卡片结构，字段固定为：

- 商家介绍 `vendor`
- 最终选品 `selection`
- 预算 `budget`
- 实际价格 `actualPrice`
- 备注 `note`

问题：

- 你要改的是“施工”分类卡片，但当前没有按类别分叉字段展示
- 也没有 PDF 字段或预览能力

### 2. 当前数据模型

- [`src/types/renovation.ts`](file:///Users/bytedance/madiyl.github.io/src/types/renovation.ts)

`MaterialItem` 当前结构：

- `id`
- `category`
- `vendor`
- `selection`
- `budget`
- `actualPrice`
- `note`

没有：

- `pdfUrl`
- `pdfTitle`

因此要支持 PDF，必须扩展数据模型。

### 3. 默认数据与合并逻辑

- [`src/lib/defaultContent.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/defaultContent.ts)

默认主材数据当前会为每个分类都写入：

- `selection`
- `note`

如果新增 PDF 字段，默认内容和远端数据合并后也要兼容旧内容。

### 4. 当前项目里没有 PDF 预览组件

在 `src` 内检索后，没有现成的 PDF 弹窗预览组件，也没有“附件字段”通用组件。

因此本次需要新增：

- 一个 PDF 附件展示/编辑区
- 一个 PDF 内嵌预览弹层

---

## Assumptions & Decisions

本次锁定以下实现决策：

1. **只修改 `施工` 分类卡片**
   - 其它主材类别继续保留“最终选品”
   - 其它类别不新增 PDF 区域

2. **施工卡片保留备注文本**
   - `note` 不删除
   - 作为简短说明或补充信息继续存在

3. **施工卡片新增 PDF 字段**
   - 至少新增一个 PDF 路径/链接字段
   - 页面中提供可点击的预览入口

4. **PDF 预览采用页面内弹窗**
   - 弹层中通过 `iframe` 或 `embed` 内嵌预览
   - 不默认跳转新标签页

5. **数据兼容旧内容**
   - 已有线上或默认主材数据没有 PDF 字段时，页面仍能正常渲染

---

## Proposed Changes

### 1. 扩展 `MaterialItem` 数据结构

#### 文件
- [`src/types/renovation.ts`](file:///Users/bytedance/madiyl.github.io/src/types/renovation.ts)

#### 做什么
- 为主材项新增 PDF 相关字段

#### 为什么
- 当前模型无法承载施工卡片的 PDF 附件

#### 怎么做
- 在 `MaterialItem` 中新增字段，例如：
  - `pdfUrl: string`
  - 如有需要可加 `pdfName: string`

本次优先采用最小改动，默认至少要有 `pdfUrl`。

---

### 2. 更新默认数据与兼容逻辑

#### 文件
- [`src/lib/defaultContent.ts`](file:///Users/bytedance/madiyl.github.io/src/lib/defaultContent.ts)

#### 做什么
- 给默认主材数据补上 PDF 相关字段默认值
- 确保旧数据合并后不会因为缺字段导致渲染异常

#### 为什么
- 当前默认内容和线上历史内容都没有 PDF 字段
- 扩展类型后必须保证读取兼容

#### 怎么做
- 所有主材默认项补 `pdfUrl: ""`
- 在 `mergeWithDefaultContent` 逻辑下，旧内容缺少该字段时仍会回落到默认空字符串

---

### 3. 按类别分叉施工卡片字段

#### 文件
- [`src/components/stages/MaterialsStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/MaterialsStage.tsx)

#### 做什么
- 仅对 `category === "施工"` 的卡片使用特殊展示逻辑

#### 为什么
- 用户明确要求只改施工卡片
- 当前所有主材项共用同一字段结构，必须在渲染层做条件分支

#### 怎么做
- 渲染卡片时判断：
  - 若 `item.category === "施工"`：
    - 不渲染“最终选品”
    - 保留“商家介绍 / 预算 / 实际价格 / 备注”
    - 新增 PDF 附件区域
  - 其它类别：
    - 保持当前结构不变

---

### 4. 新增 PDF 附件编辑与展示区

#### 文件
- 可能新增 [`src/components/common/PdfAttachmentField.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/common/PdfAttachmentField.tsx)
- 或直接内聚在 [`src/components/stages/MaterialsStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/MaterialsStage.tsx)

#### 做什么
- 为施工卡片增加一个 PDF 附件区域

#### 为什么
- 当前备注只能写纯文本，不能贴文件地址，也没有预览入口

#### 怎么做
- 编辑态：
  - 提供 PDF 路径 / 链接输入框
  - 可选再加一个附件标题
- 浏览态：
  - 若存在 PDF 地址，显示一个可点击的附件卡片或按钮
  - 文案如“查看 PDF”或使用附件名

---

### 5. 新增 PDF 预览弹层

#### 文件
- 新增 [`src/components/common/PdfPreviewDialog.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/common/PdfPreviewDialog.tsx)

#### 做什么
- 新建一个页面内 PDF 预览弹窗组件

#### 为什么
- 用户要求点击后在页内预览 PDF
- 当前项目没有这类通用组件

#### 怎么做
- 组件入参：
  - `open`
  - `url`
  - `title`
  - `onClose`
- 弹层主体：
  - 标题栏
  - 关闭按钮
  - `iframe` 或 `embed` 显示 PDF
- 空链接时不打开

---

### 6. 在施工卡片接入 PDF 预览交互

#### 文件
- [`src/components/stages/MaterialsStage.tsx`](file:///Users/bytedance/madiyl.github.io/src/components/stages/MaterialsStage.tsx)

#### 做什么
- 将施工卡片中的 PDF 附件与预览弹层接起来

#### 为什么
- 附件字段和预览能力需要完成闭环

#### 怎么做
- 在 `MaterialsStage` 中增加：
  - 当前预览 PDF 的状态
  - 打开 / 关闭预览方法
- 点击施工卡片中的 PDF 入口时：
  - 打开 `PdfPreviewDialog`
  - 将对应文件地址传入

---

## Data Flow / Interaction Flow

### 施工卡片编辑

1. 用户进入编辑模式
2. 在施工卡片中编辑：
   - 商家介绍
   - 预算
   - 实际价格
   - 备注文本
   - PDF 地址
3. 保存后写入现有主材数据结构中的施工项

### PDF 预览

1. 浏览态下用户点击施工卡片中的 PDF 附件入口
2. 页面打开 `PdfPreviewDialog`
3. 弹层通过 `iframe/embed` 预览 PDF
4. 用户关闭弹层后返回原页面

---

## Edge Cases & Failure Modes

- **施工卡片未填写 PDF**
  - 不显示预览按钮
  - 只保留备注文本

- **其它主材类别**
  - 不受影响
  - 继续保留“最终选品”

- **PDF 链接无效**
  - 弹层可能显示浏览器默认加载失败
  - 页面不崩溃

- **旧线上数据缺少 PDF 字段**
  - 回落为空字符串
  - 页面正常渲染

- **本地静态 PDF 路径**
  - 可按现有图片静态资源思路使用，例如 `/uploads/renovation/docs/xxx.pdf`

---

## Verification Steps

需要验证以下场景：

1. **施工卡片字段**
   - `category = 施工` 的卡片不再显示“最终选品”
   - 其它主材卡片仍显示“最终选品”

2. **备注与 PDF**
   - 施工卡片仍有备注文本
   - 施工卡片新增 PDF 附件输入/展示区

3. **PDF 预览**
   - 点击 PDF 入口能打开页面内弹层
   - 弹层可关闭
   - PDF 地址为空时不显示预览入口

4. **数据兼容**
   - 默认内容渲染正常
   - 旧内容没有 PDF 字段时页面不报错

5. **工程检查**
   - `npm run check`
   - `npm run lint`
   - `npm run build`

---

## Implementation Order

建议执行顺序：

1. 扩展 `MaterialItem` 类型
2. 更新默认内容与兼容逻辑
3. 在 `MaterialsStage` 按类别分叉施工卡片展示
4. 新增 PDF 附件字段与 PDF 预览弹层
5. 接通施工卡片预览交互
6. 跑 `check / lint / build`

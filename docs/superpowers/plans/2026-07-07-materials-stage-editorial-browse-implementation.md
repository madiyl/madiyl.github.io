# Materials Stage Editorial Browse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `主材选购` browse view into an editorial purchasing chapter while preserving the existing data model and edit workflow.

**Architecture:** Keep all persistence and editing behavior in `MaterialsStage.tsx`, but split browse-mode rendering into clearer presentation sections inside the same file. General material cards and tile cards will share the same warm-neutral hierarchy, while tests continue using `renderToStaticMarkup` to verify browse-only output.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Vitest

---

## File Structure

- Modify: `src/components/stages/MaterialsStage.tsx`
  - Keep normalization, add/delete, and preview state unchanged.
  - Add browse-mode presentation helpers for summary copy, identity row, price strip, and attachment row.
  - Rework `renderGeneralCard` and `renderTileCard` browse-mode markup only.
- Modify: `src/components/stages/MaterialsStage.test.tsx`
  - Expand browse-mode coverage for selected/comparison styling hooks, attachment preview wording, and editorial summaries.

## Task 1: Lock browse-mode expectations with failing tests

**Files:**
- Modify: `src/components/stages/MaterialsStage.test.tsx`
- Test: `src/components/stages/MaterialsStage.test.tsx`

- [ ] **Step 1: Replace the single browse-mode test with three focused tests**

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MaterialsStage } from "@/components/stages/MaterialsStage";
import type { MaterialItem } from "@/types/renovation";

const constructionSelected: MaterialItem = {
  id: "construction-selected",
  category: "施工",
  quoteRole: "selected",
  vendor: "梵筑施工 · 半包",
  selection: "",
  budget: 120000,
  actualPrice: 128600,
  note: "水电和木作排期已经锁定，周末复核主材到场顺序。",
  pdfUrl: "/uploads/renovation/docs/construction-quote.pdf",
  excelUrl: "",
  tileQuotes: undefined,
  tileImagePath: undefined,
};

const constructionComparison: MaterialItem = {
  ...constructionSelected,
  id: "construction-comparison",
  quoteRole: "comparison",
  vendor: "匠作施工 · 对比",
  actualPrice: 131200,
  pdfUrl: "",
};

const tileItem: MaterialItem = {
  id: "tile-1",
  category: "瓷砖",
  vendor: "东鹏瓷砖",
  selection: "",
  budget: 18000,
  actualPrice: 19600,
  note: "客厅和厨房统一木纹砖，卫生间单独切换浅灰砖。",
  pdfUrl: "",
  excelUrl: "",
  tileQuotes: [
    { id: "quote-1", label: "客厅", selection: "木纹砖", price: 8477 },
    { id: "quote-2", label: "厨房", selection: "浅灰砖", price: 5320 },
  ],
  tileImagePath: "/uploads/renovation/materials/tiles-overview.jpg",
};

describe("MaterialsStage", () => {
  it("renders general browse cards as editorial purchasing summaries", () => {
    const html = renderToStaticMarkup(
      <MaterialsStage
        materials={[constructionSelected, constructionComparison]}
        editMode={false}
        onChange={() => {}}
      />,
    );

    expect(html).toContain("已选方案");
    expect(html).toContain("对比方案");
    expect(html).toContain("梵筑施工 · 半包");
    expect(html).toContain("预算");
    expect(html).toContain("实际价格");
    expect(html).toContain("报价资料");
  });

  it("keeps browse attachments available as archive-style entries", () => {
    const html = renderToStaticMarkup(
      <MaterialsStage materials={[constructionSelected]} editMode={false} onChange={() => {}} />,
    );

    expect(html).toContain("报价资料");
    expect(html).toContain("预览 PDF 附件");
  });

  it("shows tile browse cards with image preview and room-level quote summaries", () => {
    const html = renderToStaticMarkup(
      <MaterialsStage materials={[tileItem]} editMode={false} onChange={() => {}} />,
    );

    expect(html).toContain("点击放大");
    expect(html).toContain("客厅");
    expect(html).toContain("厨房");
    expect(html).toContain("东鹏瓷砖");
  });
});
```

- [ ] **Step 2: Run the targeted test file and confirm the new expectations fail**

Run:

```bash
zsh -lc 'source ~/.zprofile >/dev/null 2>&1; cd /Users/bytedance/madiyl.github.io && npm run test -- MaterialsStage.test.tsx'
```

Expected: `FAIL` because the current browse markup does not yet contain the new archive-style label and editorial browse structure.

- [ ] **Step 3: Commit the red test baseline**

```bash
git -C /Users/bytedance/madiyl.github.io add src/components/stages/MaterialsStage.test.tsx
git -C /Users/bytedance/madiyl.github.io commit -m "test(materials-stage): define editorial browse expectations"
```

## Task 2: Rebuild general browse cards into editorial purchasing cards

**Files:**
- Modify: `src/components/stages/MaterialsStage.tsx:203-316`
- Test: `src/components/stages/MaterialsStage.test.tsx`

- [ ] **Step 1: Add browse-only summary and label helpers above `renderAttachmentSection`**

```tsx
function formatMaterialBrowseSummary(item: MaterialItem) {
  const vendor = item.vendor.trim();
  const note = item.note.trim();

  if (note) {
    return note;
  }

  if (item.category === "施工") {
    return vendor ? `把 ${vendor} 的报价、工期和落地边界放在一起看。` : "先看施工报价、工期和落地边界。";
  }
  if (item.category === "定制") {
    return vendor ? `把 ${vendor} 的柜体价格、材质和安装节点放在一起看。` : "先看定制价格、材质和安装节点。";
  }
  if (item.category === "封窗") {
    return "先看窗型方案、玻璃配置和边界处理。";
  }
  if (item.category === "石材") {
    return "把石材纹理、损耗和加工口径顺一遍。";
  }
  if (item.category === "灯光") {
    return "把灯具清单、预算和回路关系压在一起看。";
  }

  return "把报价结果、资料附件和备注信息放在一起回看。";
}

function getAttachmentBrowseLabel(item: MaterialItem) {
  if (item.category === "施工" || item.category === "定制") {
    return "报价资料";
  }
  if (item.category === "灯光") {
    return "灯光资料";
  }

  return "附件资料";
}
```

- [ ] **Step 2: Rewrite `renderAttachmentSection` browse markup as an archive row while leaving edit mode untouched**

```tsx
const renderAttachmentSection = (item: MaterialItem) => {
  const fields = attachmentConfig[item.category];
  if (!fields?.length) return null;

  return (
    <div className="space-y-3">
      {fields.map((field) => {
        const value = item[field.key];

        if (!editMode && !value) {
          return null;
        }

        if (editMode) {
          return (
            <div key={`${item.id}-${field.key}`} className="space-y-3">
              <EditableField
                label={field.label}
                value={value}
                placeholder={field.placeholder}
                editMode={editMode}
                onChange={(nextValue) => updateItem(item.id, field.key, nextValue)}
              />
              {value ? (
                <button
                  type="button"
                  onClick={() => openPreview(item, field.key, field.type)}
                  className="flex w-full items-center justify-between rounded-[22px] border border-line bg-[#f6efe6] px-4 py-3 text-left text-sm text-ink transition hover:bg-white"
                >
                  <span className="font-medium">预览 PDF 附件</span>
                  <span className="text-[#8f7d69]">点击查看</span>
                </button>
              ) : null}
            </div>
          );
        }

        return (
          <button
            key={`${item.id}-${field.key}`}
            type="button"
            onClick={() => openPreview(item, field.key, field.type)}
            className="flex w-full items-center justify-between rounded-[22px] border border-[#e9dfd2] bg-[#f8f2ea] px-4 py-3 text-left transition hover:bg-white"
          >
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a8771]">
                {getAttachmentBrowseLabel(item)}
              </div>
              <div className="text-sm font-medium text-ink">预览 PDF 附件</div>
            </div>
            <span className="text-sm text-[#8f7d69]">打开</span>
          </button>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 3: Rebuild `renderGeneralCard` browse mode into four clear layers**

```tsx
const renderGeneralCard = (item: MaterialItem) => (
  <article
    key={item.id}
    className={`rounded-[30px] border p-5 shadow-soft transition sm:p-6 ${
      !editMode && item.quoteRole === "selected"
        ? "border-[#eadcc8] bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(247,240,230,0.94))]"
        : "border-white/70 bg-white/88"
    }`}
  >
    {editMode ? (
      <div className="space-y-4">
        {/* keep existing editable fields exactly as today */}
      </div>
    ) : (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {isDualVendorCategory(item.category) ? (
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                item.quoteRole === "selected"
                  ? "bg-[#efe1cf] text-[#8a5d35]"
                  : "bg-[#ece8e1] text-[#6f675e]"
              }`}
            >
              {item.quoteRole === "selected" ? "已选方案" : "对比方案"}
            </span>
          ) : null}
          <span className="inline-flex rounded-full bg-[#f5ede4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8f7d69]">
            {item.category}
          </span>
        </div>

        <div className="space-y-2">
          <div className="text-[1.1rem] font-semibold tracking-[-0.02em] text-ink">
            {item.vendor.trim() || `${item.category}待补充商家`}
          </div>
          <div className="text-sm leading-7 text-[#6f6256]">
            {formatMaterialBrowseSummary(item)}
          </div>
        </div>

        <div className="grid gap-3 rounded-[24px] border border-[#eee3d5] bg-[#fcf8f3] p-3 sm:grid-cols-3">
          <div className="rounded-[18px] bg-white/88 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#9b8a76]">预算</div>
            <div className="mt-2 text-base font-semibold text-ink">¥{item.budget.toLocaleString()}</div>
          </div>
          <div className="rounded-[18px] bg-white/88 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#9b8a76]">实际价格</div>
            <div className="mt-2 text-base font-semibold text-ink">¥{item.actualPrice.toLocaleString()}</div>
          </div>
          <div className="rounded-[18px] bg-white/88 px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#9b8a76]">结果</div>
            <div className="mt-2">
              <PriceBadge budget={item.budget} actualPrice={item.actualPrice} />
            </div>
          </div>
        </div>

        {renderAttachmentSection(item)}
      </div>
    )}

    {editMode ? (
      <button
        type="button"
        onClick={() => onChange(materials.filter((entry) => entry.id !== item.id))}
        className="mt-4 text-sm font-medium text-[#9a5b49]"
      >
        删除这一项
      </button>
    ) : null}
  </article>
);
```

- [ ] **Step 4: Run the targeted tests and verify Task 1 expectations now pass**

Run:

```bash
zsh -lc 'source ~/.zprofile >/dev/null 2>&1; cd /Users/bytedance/madiyl.github.io && npm run test -- MaterialsStage.test.tsx'
```

Expected: `PASS` for the general-card and attachment tests. The tile test may still need adjustment until Task 3 lands.

- [ ] **Step 5: Commit the general browse card rebuild**

```bash
git -C /Users/bytedance/madiyl.github.io add src/components/stages/MaterialsStage.tsx src/components/stages/MaterialsStage.test.tsx
git -C /Users/bytedance/madiyl.github.io commit -m "feat(materials-stage): redesign general browse cards"
```

## Task 3: Align tile browse cards with the same editorial system

**Files:**
- Modify: `src/components/stages/MaterialsStage.tsx:318-420`
- Test: `src/components/stages/MaterialsStage.test.tsx`

- [ ] **Step 1: Add a tile-specific summary helper near the general browse helper**

```tsx
function formatTileBrowseSummary(item: MaterialItem) {
  const note = item.note.trim();
  if (note) {
    return note;
  }

  return "把空间报价、砖型选择和铺贴范围放在一起看。";
}
```

- [ ] **Step 2: Rework `renderTileCard` browse markup so it stays image-led but visually matches other material cards**

```tsx
const renderTileCard = (item: MaterialItem) => (
  <article
    key={item.id}
    className="rounded-[30px] border border-white/70 bg-white/88 p-5 shadow-soft sm:p-6"
  >
    {editMode ? (
      <div className="space-y-5">
        {/* keep current tile edit-mode fields exactly as today */}
      </div>
    ) : (
      <div className="space-y-5">
        <div className="space-y-2">
          <span className="inline-flex rounded-full bg-[#f5ede4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8f7d69]">
            瓷砖
          </span>
          <div className="text-[1.1rem] font-semibold tracking-[-0.02em] text-ink">
            {item.vendor.trim() || "待补充瓷砖商家"}
          </div>
        </div>

        <ImagePathField
          value={item.tileImagePath ?? ""}
          alt="瓷砖示意图"
          editMode={false}
          onChange={() => {}}
          ratioClassName="aspect-[16/9]"
          previewable
          onPreview={() => setPreviewImageItemId(item.id)}
          zoomOnHover={false}
        />

        <div className="grid gap-3 rounded-[24px] border border-[#eee3d5] bg-[#fcf8f3] p-3 md:grid-cols-2 xl:grid-cols-4">
          {(item.tileQuotes ?? []).map((quote) => (
            <div key={quote.id} className="rounded-[18px] bg-white/88 px-4 py-4">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#9b8a76]">{quote.label}</div>
              <div className="mt-2 text-sm font-semibold text-ink">{quote.selection || "待补充材料"}</div>
              <div className="mt-3 text-sm text-[#6f6256]">¥{quote.price.toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[18px] border border-[#eee3d5] bg-[#fcf8f3] px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#9b8a76]">预算</div>
            <div className="mt-2 text-base font-semibold text-ink">¥{item.budget.toLocaleString()}</div>
          </div>
          <div className="rounded-[18px] border border-[#eee3d5] bg-[#fcf8f3] px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#9b8a76]">实际价格</div>
            <div className="mt-2 text-base font-semibold text-ink">¥{item.actualPrice.toLocaleString()}</div>
          </div>
          <div className="rounded-[18px] border border-[#eee3d5] bg-[#fcf8f3] px-4 py-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#9b8a76]">备注</div>
            <div className="mt-2 text-sm leading-6 text-[#6f6256]">{formatTileBrowseSummary(item)}</div>
          </div>
        </div>
      </div>
    )}

    {editMode ? (
      <button
        type="button"
        onClick={() => onChange(materials.filter((entry) => entry.id !== item.id))}
        className="mt-4 text-sm font-medium text-[#9a5b49]"
      >
        删除这一项
      </button>
    ) : null}
  </article>
);
```

- [ ] **Step 3: Update the test fixture expectations to assert the new tile summary wording**

```tsx
it("shows tile browse cards with image preview and room-level quote summaries", () => {
  const html = renderToStaticMarkup(
    <MaterialsStage materials={[tileItem]} editMode={false} onChange={() => {}} />,
  );

  expect(html).toContain("点击放大");
  expect(html).toContain("客厅");
  expect(html).toContain("厨房");
  expect(html).toContain("东鹏瓷砖");
  expect(html).toContain("客厅和厨房统一木纹砖");
});
```

- [ ] **Step 4: Run tests and type-check the finished browse redesign**

Run:

```bash
zsh -lc 'source ~/.zprofile >/dev/null 2>&1; cd /Users/bytedance/madiyl.github.io && npm run test -- MaterialsStage.test.tsx && npm run check'
```

Expected: `PASS` for both the targeted test file and TypeScript check.

- [ ] **Step 5: Commit the tile card alignment and final verification**

```bash
git -C /Users/bytedance/madiyl.github.io add src/components/stages/MaterialsStage.tsx src/components/stages/MaterialsStage.test.tsx
git -C /Users/bytedance/madiyl.github.io commit -m "feat(materials-stage): align tile cards with editorial browse layout"
```

## Self-Review

- Spec coverage: Task 2 implements the general card identity/vendor/price/evidence hierarchy and selected-vs-comparison treatment. Task 3 implements the image-led tile card and preserves preview behavior. No task touches schema or persistence.
- Placeholder scan: No `TODO`, `TBD`, or implied “handle appropriately” instructions remain.
- Type consistency: All planned helpers use existing `MaterialItem` properties only (`category`, `vendor`, `note`, `budget`, `actualPrice`, `tileQuotes`, `tileImagePath`, `quoteRole`).


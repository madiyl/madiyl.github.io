# Design Stage Cover Card Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the design-stage browse cards into cover cards and rebuild click-through preview into an immersive large-image viewer without changing the underlying design data model.

**Architecture:** Keep browse-mode card presentation logic inside `src/components/stages/DesignStage.tsx` and keep the preview shell inside `src/components/common/ImageLightbox.tsx`. Preserve edit-mode behavior and existing `design` data flow, while passing only the minimal metadata required for the immersive preview.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, Tailwind CSS, Framer Motion

---

## File Map

- Modify: `src/components/stages/DesignStage.tsx`
  - Split browse-mode and edit-mode presentation more clearly
  - Convert browse cards into image-led cover cards
  - Prepare preview image metadata and open the correct image on click
- Modify: `src/components/common/ImageLightbox.tsx`
  - Replace generic side-panel lightbox structure with immersive large-image layout
  - Keep keyboard and overlay-close behavior
  - Add thin metadata bar and filmstrip navigation
- Create: `src/components/stages/DesignStage.test.tsx`
  - Verify browse-mode cover card cues and preview entry affordance
- Optional verify only: `src/components/stages/MaterialsStage.test.tsx`
  - Read-only reference for existing preview label expectations

## Task 1: Add Failing DesignStage Browse Test

**Files:**
- Create: `src/components/stages/DesignStage.test.tsx`
- Modify: `src/components/stages/DesignStage.tsx`
- Test: `src/components/stages/DesignStage.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DesignStage } from "@/components/stages/DesignStage";
import type { RenovationPageData } from "@/types/renovation";

describe("DesignStage", () => {
  it("renders cover-card browse cues and preview entry text", () => {
    const design: RenovationPageData["design"] = {
      floorPlans: [
        {
          id: "design-floor-1",
          group: "floorPlans",
          title: "客餐厅平面方案",
          note: "先看动线、收纳和岛台关系。",
          imagePath: "/uploads/renovation/design/floor-01.jpg",
        },
      ],
      elevations: [],
      renders: [],
    };

    const html = renderToStaticMarkup(
      <DesignStage design={design} editMode={false} onChange={() => {}} />,
    );

    expect(html).toContain("点击放大");
    expect(html).toContain("客餐厅平面方案");
    expect(html).toContain("平面设计");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
zsh -lc 'source ~/.zprofile >/dev/null 2>&1; cd /Users/bytedance/madiyl.github.io && npm run test -- DesignStage.test.tsx'
```

Expected: FAIL because `DesignStage.test.tsx` does not exist yet or browse cues do not match the new cover-card output.

- [ ] **Step 3: Create the test file**

Create `src/components/stages/DesignStage.test.tsx` with the exact content from Step 1.

- [ ] **Step 4: Run test again to confirm it now evaluates the current UI**

Run:

```bash
zsh -lc 'source ~/.zprofile >/dev/null 2>&1; cd /Users/bytedance/madiyl.github.io && npm run test -- DesignStage.test.tsx'
```

Expected: FAIL against current implementation if the new browse-card cues are not yet implemented.

- [ ] **Step 5: Commit**

```bash
git add src/components/stages/DesignStage.test.tsx
git commit -m "test: add design stage browse coverage"
```

## Task 2: Rebuild DesignStage Browse Cards As Cover Cards

**Files:**
- Modify: `src/components/stages/DesignStage.tsx`
- Test: `src/components/stages/DesignStage.test.tsx`

- [ ] **Step 1: Update group metadata to support cover-card styling**

Replace the current `groupMeta` declaration with:

```tsx
const groupMeta: Record<
  DesignGroupKey,
  {
    title: string;
    description: string;
    eyebrow: string;
    chipClassName: string;
    panelClassName: string;
  }
> = {
  floorPlans: {
    title: "平面设计",
    description: "先把动线、尺寸和收纳判断压成同一张图。",
    eyebrow: "Layout Study",
    chipClassName: "bg-[rgba(241,226,209,0.92)] text-[#8a6547]",
    panelClassName:
      "bg-[linear-gradient(180deg,rgba(247,241,233,0.98),rgba(242,234,224,0.92))]",
  },
  elevations: {
    title: "立面设计",
    description: "把比例、灯光和局部收口集中回看。",
    eyebrow: "Elevation Review",
    chipClassName: "bg-[rgba(235,225,214,0.92)] text-[#755b48]",
    panelClassName:
      "bg-[linear-gradient(180deg,rgba(248,242,235,0.98),rgba(240,231,221,0.92))]",
  },
  renders: {
    title: "效果图",
    description: "用氛围图确认材质、色调和整体情绪。",
    eyebrow: "Atmosphere Draft",
    chipClassName: "bg-[rgba(228,221,211,0.92)] text-[#6a5d52]",
    panelClassName:
      "bg-[linear-gradient(180deg,rgba(247,240,233,0.98),rgba(238,230,220,0.92))]",
  },
};
```

- [ ] **Step 2: Add keyboard helper for clickable browse cards**

Add this helper inside `DesignStage`:

```tsx
  const handleCardKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    group: DesignGroupKey,
    assetId: string,
    canPreview: boolean,
  ) => {
    if (!canPreview) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPreview(group, assetId);
    }
  };
```

- [ ] **Step 3: Prepare preview metadata in `previewImages`**

Replace the existing `previewImages` block with:

```tsx
  const previewImages = useMemo(() => {
    if (!previewGroup) return [];

    const previewableItems = design[previewGroup].filter(
      (item: DesignAsset) => Boolean(item.imagePath),
    );

    return previewableItems.map((item: DesignAsset, index: number) => ({
      src: item.imagePath,
      alt: item.title || groupMeta[previewGroup].title,
      caption: item.note,
      eyebrow: groupMeta[previewGroup].title,
      meta: `${index + 1} / ${previewableItems.length}`,
    }));
  }, [design, previewGroup]);
```

- [ ] **Step 4: Replace browse-mode card rendering with cover-card structure**

Inside the `design[group].map(...)` block, keep edit mode form behavior, but replace browse mode with this structure:

```tsx
                {design[group].map((asset: DesignAsset, index: number) => {
                  const meta = groupMeta[group];
                  const canPreview = !editMode && Boolean(asset.imagePath);
                  const displayTitle =
                    asset.title.trim() || `${meta.title} · 方案 ${index + 1}`;
                  const displaySummary =
                    asset.note.trim() || meta.description;

                  return (
                    <motion.article
                      key={asset.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                      role={canPreview ? "button" : undefined}
                      tabIndex={canPreview ? 0 : undefined}
                      onClick={
                        canPreview ? () => openPreview(group, asset.id) : undefined
                      }
                      onKeyDown={(event) =>
                        handleCardKeyDown(event, group, asset.id, canPreview)
                      }
                      className={`overflow-hidden rounded-[30px] border border-white/70 shadow-soft transition ${
                        editMode
                          ? "bg-white/82 p-4"
                          : `${meta.panelClassName} ${canPreview ? "cursor-zoom-in hover:-translate-y-0.5 hover:shadow-[0_24px_50px_rgba(98,79,60,0.12)] focus:outline-none focus:ring-2 focus:ring-[rgba(141,111,82,0.28)]" : ""}`
                      }`}
                    >
                      {editMode ? (
                        <>
                          <ImagePathField
                            value={asset.imagePath}
                            alt={asset.title || groupMeta[group].title}
                            editMode={editMode}
                            previewable
                            onPreview={() => openPreview(group, asset.id)}
                            onChange={(value: string) =>
                              updateGroup(group, (items) =>
                                items.map((item) =>
                                  item.id === asset.id
                                    ? { ...item, imagePath: value }
                                    : item,
                                ),
                              )
                            }
                          />
                          <div className="mt-4 space-y-3">
                            <EditableField
                              label="标题"
                              value={asset.title}
                              placeholder="例如：客厅立面推敲"
                              editMode={editMode}
                              onChange={(value: string) =>
                                updateGroup(group, (items) =>
                                  items.map((item) =>
                                    item.id === asset.id
                                      ? { ...item, title: value }
                                      : item,
                                  ),
                                )
                              }
                              displayClassName="text-lg font-semibold text-ink"
                            />
                            <EditableField
                              label="说明"
                              value={asset.note}
                              placeholder="记录这张图的重点、版本差异或确认事项"
                              editMode={editMode}
                              multiline
                              onChange={(value: string) =>
                                updateGroup(group, (items) =>
                                  items.map((item) =>
                                    item.id === asset.id
                                      ? { ...item, note: value }
                                      : item,
                                  ),
                                )
                              }
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative">
                            <ImagePathField
                              value={asset.imagePath}
                              alt={displayTitle}
                              editMode={false}
                              onChange={() => {}}
                              previewable={false}
                              zoomOnHover={false}
                              ratioClassName="aspect-[4/3]"
                            />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(28,22,18,0),rgba(28,22,18,0.78))] px-5 pb-5 pt-12">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${meta.chipClassName}`}
                                >
                                  {meta.eyebrow}
                                </span>
                                <span className="rounded-full bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/82">
                                  第 {index + 1} 张
                                </span>
                              </div>
                              <div className="mt-3 text-[1.18rem] font-semibold tracking-[-0.025em] text-white">
                                {displayTitle}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 px-5 py-5">
                            <div className="text-sm leading-7 text-[#6b5f54]">
                              {displaySummary}
                            </div>
                            {asset.imagePath ? (
                              <div className="flex items-center justify-between border-t border-[rgba(143,125,105,0.14)] pt-3 text-[13px] text-[#7a6b5c]">
                                <span>点击进入大图预览</span>
                                <span className="text-base leading-none">↗</span>
                              </div>
                            ) : null}
                          </div>
                        </>
                      )}

                      {editMode ? (
                        <button
                          type="button"
                          onClick={() =>
                            updateGroup(group, (items) =>
                              items.filter((item) => item.id !== asset.id),
                            )
                          }
                          className="mt-4 px-4 pb-4 text-sm font-medium text-[#9a5b49]"
                        >
                          删除这一项
                        </button>
                      ) : null}
                    </motion.article>
                  );
                })}
```

- [ ] **Step 5: Run the targeted test**

Run:

```bash
zsh -lc 'source ~/.zprofile >/dev/null 2>&1; cd /Users/bytedance/madiyl.github.io && npm run test -- DesignStage.test.tsx'
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/stages/DesignStage.tsx src/components/stages/DesignStage.test.tsx
git commit -m "feat: redesign design stage cover cards"
```

## Task 3: Rebuild ImageLightbox As Immersive Preview

**Files:**
- Modify: `src/components/common/ImageLightbox.tsx`
- Modify: `src/components/stages/DesignStage.tsx`
- Test: `src/components/stages/DesignStage.test.tsx`

- [ ] **Step 1: Expand lightbox image type and props**

At the top of `src/components/common/ImageLightbox.tsx`, replace the types with:

```tsx
type LightboxImage = {
  src: string;
  alt: string;
  caption?: string;
  eyebrow?: string;
  meta?: string;
};

type ImageLightboxProps = {
  open: boolean;
  images: LightboxImage[];
  activeIndex: number;
  onClose: () => void;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  panelTitle?: string;
  panelDescription?: string;
};
```

- [ ] **Step 2: Replace the current lightbox layout with immersive viewer layout**

Replace the current return block inside `ImageLightbox` with:

```tsx
  const current = images[activeIndex] ?? images[0];
  const counter = `${activeIndex + 1} / ${images.length}`;

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-[rgba(17,13,10,0.88)] p-3 backdrop-blur-md sm:p-5"
      onClick={onClose}
    >
      <div
        className="mx-auto my-2 flex w-full max-w-[1240px] max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(36,29,24,0.96),rgba(22,18,15,0.98))] p-3 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:my-4 sm:max-h-[calc(100dvh-2.5rem)] sm:rounded-[32px] sm:p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4 rounded-[22px] border border-white/8 bg-white/[0.04] px-4 py-3 text-white/92 sm:mb-4 sm:px-5">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {current.eyebrow ? (
                <span className="rounded-full bg-[rgba(233,208,176,0.16)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8ccb0]">
                  {current.eyebrow}
                </span>
              ) : null}
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72">
                {current.meta || counter}
              </span>
            </div>

            {(panelTitle || current.alt) ? (
              <div className="min-w-0">
                <div className="truncate text-lg font-semibold tracking-[-0.025em] text-white sm:text-[1.35rem]">
                  {current.alt || panelTitle}
                </div>
                {panelTitle && current.alt && panelTitle !== current.alt ? (
                  <div className="mt-1 text-sm text-white/55">
                    {panelTitle}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/18"
          >
            关闭
          </button>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_center,rgba(77,64,54,0.38),rgba(21,17,14,0.96))] sm:rounded-[28px]">
          <div className="absolute inset-y-0 left-3 flex items-center sm:left-4">
            {images.length > 1 ? (
              <button
                type="button"
                onClick={onPrev}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-medium text-white transition hover:bg-white/18 sm:h-11 sm:w-11"
                aria-label="上一张"
              >
                ‹
              </button>
            ) : null}
          </div>

          <div className="absolute inset-y-0 right-3 flex items-center sm:right-4">
            {images.length > 1 ? (
              <button
                type="button"
                onClick={onNext}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-medium text-white transition hover:bg-white/18 sm:h-11 sm:w-11"
                aria-label="下一张"
              >
                ›
              </button>
            ) : null}
          </div>

          <div className="flex h-full min-h-[46dvh] items-center justify-center px-10 py-6 sm:min-h-[62dvh] sm:px-16 sm:py-8">
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[52dvh] w-full object-contain sm:max-h-[68dvh]"
            />
          </div>
        </div>

        {(current.caption || panelDescription) ? (
          <div className="mt-3 rounded-[20px] bg-white/[0.05] px-4 py-3 text-sm leading-7 text-white/72 sm:mt-4 sm:px-5">
            {current.caption || panelDescription}
          </div>
        ) : null}

        {images.length > 1 ? (
          <div className="mt-3 rounded-[22px] border border-white/8 bg-white/[0.04] p-3 sm:mt-4 sm:rounded-[24px] sm:p-4">
            <div className="mb-3 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/48">
              胶片导航
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={`${image.src}-${index}`}
                  type="button"
                  onClick={() => onSelect(index)}
                  className={`w-24 shrink-0 overflow-hidden rounded-[18px] border transition sm:w-28 ${
                    index === activeIndex
                      ? "border-[#d6a66a] shadow-[0_12px_30px_rgba(0,0,0,0.28)]"
                      : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
```

- [ ] **Step 3: Pass group-level preview metadata from `DesignStage`**

Update the `ImageLightbox` call in `src/components/stages/DesignStage.tsx` to:

```tsx
      <ImageLightbox
        open={Boolean(previewGroup && previewImages.length)}
        images={previewImages}
        activeIndex={previewIndex}
        panelTitle={previewGroup ? groupMeta[previewGroup].title : undefined}
        panelDescription={
          previewGroup ? groupMeta[previewGroup].description : undefined
        }
        onClose={closePreview}
        onSelect={(index: number) => setPreviewIndex(index)}
        onPrev={() =>
          setPreviewIndex((current) =>
            current === 0 ? previewImages.length - 1 : current - 1
          )
        }
        onNext={() =>
          setPreviewIndex((current) =>
            current === previewImages.length - 1 ? 0 : current + 1
          )
        }
      />
```

- [ ] **Step 4: Run targeted tests**

Run:

```bash
zsh -lc 'source ~/.zprofile >/dev/null 2>&1; cd /Users/bytedance/madiyl.github.io && npm run test -- DesignStage.test.tsx MaterialsStage.test.tsx'
```

Expected: PASS.

- [ ] **Step 5: Run type check**

Run:

```bash
zsh -lc 'source ~/.zprofile >/dev/null 2>&1; cd /Users/bytedance/madiyl.github.io && npm run check'
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/common/ImageLightbox.tsx src/components/stages/DesignStage.tsx src/components/stages/DesignStage.test.tsx
git commit -m "feat: redesign design preview experience"
```

## Self-Review

- Spec coverage:
  - cover-card browse mode -> Task 2
  - immersive preview -> Task 3
  - accessibility and keyboard behavior -> Task 2 + Task 3
  - no data model changes -> preserved across all tasks
- Placeholder scan:
  - no TODO/TBD markers remain
- Type consistency:
  - `DesignAsset`, `DesignGroupKey`, `ImageLightbox` props, and preview handlers match the existing codebase naming

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-07-design-stage-cover-card-preview-implementation.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?


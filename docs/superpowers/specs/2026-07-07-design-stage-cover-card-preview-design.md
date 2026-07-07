# Design Stage Cover Card And Preview Design

## Scope

This spec covers only the browse-mode redesign of the `DesignStage` card grid and its click-through preview experience.

Included:
- redesign of browse-mode design cards in `src/components/stages/DesignStage.tsx`
- redesign of image preview behavior in `src/components/common/ImageLightbox.tsx`
- preservation of existing edit-mode behavior and existing `design` data structure

Excluded:
- changes to `design` data schema
- changes to upload/storage behavior
- changes to other stages

## Goal

Turn the design section from a record list into a small editorial gallery:

- cards should read like cover cards, not form blocks
- images should lead the hierarchy
- text on cards should stay concise and secondary
- clicking a card should open a calm, immersive design-preview experience

## User Intent

The user wants the design stage to feel more like reviewing real design drafts:

- browse mode should feel visual and warm
- cards should be display-first
- preview should not feel like a generic utility modal
- close and navigation controls must remain obvious and usable

## Design Direction

### Recommended Direction

Use a **cover-card gallery** for browse mode and an **immersive large-image preview** for click-through viewing.

Reasoning:
- this matches the user’s request for stronger design atmosphere
- it separates browse-mode scanning from detail viewing cleanly
- it avoids stuffing card bodies with too much explanation

### Rejected Alternatives

1. Index-card layout
   - good for scanning
   - too administrative for this section

2. Review-panel preview
   - good for information density
   - too tool-like and visually heavy

## Card Design

### Browse Mode

Each design asset card should behave like a compact cover:

- image dominates the card
- card title appears as the primary textual anchor
- one short summary line appears below the title
- group identity appears as a small chapter-style label
- long notes are not fully expanded on the card

Visual hierarchy:
1. image
2. title
3. group label
4. short note/summary

Interaction:
- the entire card is clickable when an image exists
- hover motion stays subtle: light lift, slight image push, stronger border/shadow
- keyboard access is preserved with `Enter` and `Space`

### Edit Mode

Edit mode remains form-oriented and largely unchanged.

Reasoning:
- browse mode and edit mode serve different jobs
- the user asked for display quality first, not form redesign

## Preview Design

### Structure

The preview should become an immersive viewer with three layers:

1. top bar
   - group label
   - image counter
   - current title
   - close button

2. main stage
   - current image centered and dominant
   - left/right navigation arrows when multiple images exist

3. bottom filmstrip
   - horizontal thumbnail strip for switching images

### Behavior

- clicking a design card opens the preview at the corresponding image
- `Esc` closes preview
- left/right arrow keys switch images
- clicking overlay closes preview
- clicking inside viewer does not close preview
- thumbnails update active state clearly

### Content Rules

- use current image title as the main preview heading
- use group title as secondary context
- show note content only as a lightweight support line, not as a heavy side panel
- if note is empty, do not render extra filler UI

## Component Responsibilities

### `DesignStage`

Responsible for:
- browse/edit rendering split
- card click entry
- computing preview image list for the active group
- opening preview at the correct image index

Not responsible for:
- detailed viewer layout internals

### `ImageLightbox`

Responsible for:
- immersive preview shell
- current-image display
- navigation controls
- top-bar metadata presentation
- thumbnail filmstrip

Not responsible for:
- card-specific grouping logic beyond props it receives

## Data Flow

1. `DesignStage` renders grouped assets from existing `design[group]`
2. browse-mode card click calls `openPreview(group, assetId)`
3. `openPreview` resolves previewable assets for the group and matching index
4. `ImageLightbox` receives:
   - image list
   - active index
   - close/select/prev/next handlers
   - optional group-level title/description metadata
5. lightbox renders current image plus navigation UI

## Error Handling

- if an asset has no `imagePath`, it is not previewable
- if preview index cannot be resolved, preview does not open
- if group has no previewable images, lightbox stays closed
- empty notes do not render decorative placeholders

## Accessibility

- keep preview controls as real buttons
- preserve keyboard navigation
- keep visible focus styles on clickable cards
- keep close button always visible within viewport bounds
- maintain sufficient contrast in dark preview mode

## Testing

Focused verification is sufficient:

1. browse mode
   - cards render with image-first hierarchy
   - cards with images are clickable
   - cards without images do not open preview

2. preview
   - opens on the correct image
   - next/prev wrap correctly
   - close works by button, overlay, and `Esc`
   - thumbnail selection updates active image

3. regressions
   - edit mode still supports title, note, and image path editing
   - existing default content continues to render

## Implementation Notes

- keep edits scoped to `DesignStage.tsx` and `ImageLightbox.tsx`
- reuse `ImagePathField` where possible
- do not introduce new data fields for this redesign
- prefer warm neutral colors already used in the project


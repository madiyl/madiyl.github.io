# Materials Stage Editorial Browse Design

## Overview

This spec defines the next UI/UX iteration for the `主材选购` module in browse mode.

The goal is to make the module feel like an editorial purchasing chapter rather than a raw record form, while keeping the current data model, field set, and edit workflow unchanged.

## Goals

1. Make the browse view feel warmer, cleaner, and more intentional.
2. Keep information balanced across vendor, pricing, attachments, and notes.
3. Preserve existing material data structure and editing logic.
4. Make selected vs comparison entries readable at a glance without turning the module into a finance dashboard.
5. Keep the tile section visually richer, but aligned with the rest of the module.

## Non-Goals

1. No schema changes to `MaterialItem` or related types.
2. No changes to save/load behavior.
3. No redesign of edit mode interaction flow.
4. No new attachment types or pricing calculations.

## Current Problems

The current `MaterialsStage` browse experience has three issues:

1. Cards read like form dumps rather than curated summaries.
2. Vendor, price, note, and attachment information sit at the same visual weight.
3. The tile card and general material card do not yet feel like part of one editorial system.

## Chosen Direction

Use an editorial browse layout with two related card types:

1. `General Material Card`
2. `Tile Material Card`

Both cards should share the same visual language:

- warm neutral surfaces
- restrained border and shadow treatment
- clear vertical information hierarchy
- compact evidence entry points
- concise note summaries

The module should feel like a chapter of purchasing decisions, not an admin panel.

## Information Hierarchy

Each browse card should prioritize information in this order:

1. Identity
2. Main vendor information
3. Price result
4. Supporting evidence
5. Notes

This keeps the module balanced instead of letting price dominate everything.

## Browse Mode Design

### 1. General Material Card

Applicable categories:

- `施工`
- `定制`
- `封窗`
- `木地板`
- `石材`
- `灯光`
- `其它`

Card structure:

1. `Identity Row`
   - selected/comparison chip when applicable
   - category tone marker if useful
2. `Vendor Block`
   - vendor name or main supplier text as the card title
   - optional secondary line from the existing vendor text if needed
3. `Price Result Strip`
   - budget
   - actual price
   - delta or result state via the existing `PriceBadge`
4. `Evidence Row`
   - PDF or supporting attachment shown as a compact archive-style entry
   - not a generic button-looking block
5. `Note Summary`
   - condensed browse-only summary style
   - keep compact, avoid large multiline text blocks unless content is substantial

### 2. Tile Material Card

Applicable category:

- `瓷砖`

Card structure:

1. top visual image area remains important
2. middle quote cluster shows room-level tile selections and pricing
3. lower section aligns with the rest of the module:
   - budget
   - actual price
   - note summary

The tile card should feel like an image-led material card, not a separate product with unrelated styling.

## Selected vs Comparison Treatment

For dual-vendor categories:

- selected entry should feel steadier and slightly warmer
- comparison entry should feel lighter and quieter
- the distinction should be clear but not aggressive

This means:

- no heavy warning colors
- no over-contrasted financial emphasis
- no loud badges that overpower content

## Browse vs Edit Boundary

This iteration changes browse mode only.

### Browse mode

- redesigned for readability and presentation
- stronger hierarchy
- cleaner attachment presentation
- more curated note display

### Edit mode

- keep existing input flow
- keep current field coverage
- keep current add/delete behavior
- avoid reordering fields unless required by implementation safety

## Content Style

Browse-mode copy should follow these rules:

1. short and readable
2. warm but not decorative
3. avoid repetitive action verbs
4. prefer concise editorial phrasing over system-like labels

## Technical Scope

Primary file:

- `src/components/stages/MaterialsStage.tsx`

Possible related files only if needed:

- `src/components/stages/MaterialsStage.test.tsx`
- shared presentational helpers already used by the module

Out of scope unless implementation proves necessary:

- `src/types/renovation.ts`
- API or persistence files

## Testing Strategy

Add or update focused tests that validate browse-mode output:

1. selected/comparison markers still render correctly
2. attachment preview entries remain available
3. tile image preview behavior remains intact
4. key browse-mode summaries still render in server output

Use the existing `vitest + renderToStaticMarkup` pattern already present in the codebase.

## Acceptance Criteria

The design is successful when:

1. browse cards no longer feel like raw forms
2. price, vendor, attachment, and note information feel balanced
3. selected vs comparison is readable within one glance
4. tile cards visually belong to the same chapter as other materials
5. edit mode behavior remains functionally unchanged
6. no data shape or persistence logic changes are introduced


# Scroll-linked Anatomy illustrations

Uses the MIT-licensed `wheresryan22/anatomy` SVG kit, vendored in `src/vendor/anatomy/` (license included). Original machine geometry lives in `src/lib/anatomy/geometry.ts`; slide states in `states.ts`. The client receives only SVG, projected axis vectors and state definitions, not the geometry kit.

## Context → object → motion

| Slides | Object | Moving part |
| --- | --- | --- |
| 1 | Classroom with problem board and four student desks | Selected orange worksheet advances on the desk |
| 3, 10 | Binding press | Guided platen moves down toward the document set |
| 2, 4 | School document cabinet | Selected drawer slides forward |
| 5, 6 | Two-page comparison scanner | Head travels between source and transformed question |
| 7 | Bookcase | One supplementary textbook slides out |
| 8 | Cash register | Four-compartment cash drawer opens |
| 9 | Sample printer | Printed sheet advances onto output tray |
| 11 | Document vault | Guided door reveals accumulated records |

These are conceptual explanations, not measurements or simulations of real production equipment.

## Construction

Shared base: four feet and pads, beveled plinth, perimeter groove, fasteners and ruler strip. Each machine adds physical supports, panels and a constrained moving assembly. All solids use the kit's paper fills, shaded sides and bevels rather than transparent wireframes. Small square fasteners avoid unnecessary round-body machinery. Typography and card framing are intentionally omitted at the user's request. The classroom uses the deck's orange accent for selected question cards and the selected worksheet; the other parts stay neutral.

## Motion and layout

- Existing deck scroll tracker publishes `data-active`; a single animation loop follows the selected scene with a time-based exponential follow (tau 0.22 seconds).
- Motion retargets from its current position. It stops at rest, while hidden, below 1181px, or outside the viewport.
- Reduced motion jumps directly to the appropriate static pose, with no crossfade.
- One large fixed SVG assembly at bottom left; an alpha-mask gradient fades it before the right-hand copy. Pointer events are disabled. Decorative art is hidden from accessibility and print.
- No idle loops, labels, controls or additional motion dependency.

## Checks performed

Production build, all 11 scroll states (exactly one settled visible machine), no visible illustration text, mobile horizontal overflow, light/dark rendering. Anatomy line-end checks returned zero floating ends for the scanner, bookcase, cash register, printer and vault. These checks do not constitute a complete 3D collision/depth audit.

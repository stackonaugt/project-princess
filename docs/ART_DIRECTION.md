# Laverton art pilot

## Agreed direction

Preserve the existing game's crisp, playful pixel art. Seb's Helen and Paddy wedding artwork guides colour, recognisable architecture and character. The supplied Stardew/city references guide depth and readable detail. Avoid painterly concept-art styling, blur and inconsistent pixel sizes.

First area: the home, Allen St and backyard. Establish Helen and the house exterior together before extending the treatment to interiors, garden objects and the rest of the street.

## Implemented on the art branch

- `src/art/paint/allen-house.js`: a new 136x92 house painter based on the supplied frontage photograph. Cream-yellow brick, terracotta tiles, white trim, recessed screen door, vertical porch enclosure and concrete steps. Registered as the existing `hphouse` object; the 8x3 collision footprint and door location are unchanged.
- `src/art/paint/helen.js`: dedicated 16x32 down, up and left frames, each with standing and two walking poses. Brown hair, clear glasses, smaller facial proportions and the existing red plaid pinafore. Right-facing movement still mirrors the left frames.
- `src/art/textures.js`: uses the Helen painter for her built-in player textures. Custom PNG overrides continue to take precedence. Other characters retain their existing painter.

These are first-pass art changes awaiting visual feedback. The home interior, yard, other houses, camera and gameplay have not been altered in this pilot.

Feedback: Seb approved the general direction on 7 October 2026. Helen's front-facing pupils and clear glasses were corrected to share a level, symmetrical placement across standing and walking frames. Action animations (for example waving, patting and watering) are proposed for a subsequent pass; they are not implemented yet.

Helen's clear glasses now have a one-pixel centre bridge and outer stems, with a matching temple arm in the side view. This applies to standing and walking frames.

## References reviewed

The user's Drive reference collection includes the original wedding artwork, Helen photographs, city-style pixel-art examples, the Allen St frontage, floor plan, renovation photographs, lounge colour, kitchen and backyard. Keep original personal photos in the reference collection, not in the public game repository.

## Next passes

1. Review Helen's proportions and outfit, and the house palette at game scale.
2. Carry the established materials into the back roof, shed, carport and garden.
3. Apply the interior reference colours while retaining renovation and upgrade states.
4. Review the three connected areas in a browser, including door alignment, object layering, walking and custom sprite overrides.

## Documentation maintenance

Update player-facing instructions in `README.md` when behaviour changes. Update `CLAUDE.md` when architecture or mechanics change, and `assets/sprites/README.md` when asset specifications change. Keep implemented work and planned work separate. Record visual decisions here as they are agreed.

## Validation for this pass

The house and all nine Helen frames were rendered through the game's pixel painter and outline helper, and their texture dimensions were checked. JavaScript syntax and module imports were checked. This pass has not yet been playtested in the browser or published to GitHub Pages.

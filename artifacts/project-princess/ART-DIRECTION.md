# Project Princess — art direction

## Goal and priority

Improve the existing Phaser game's art incrementally, without replacing its personal setting or rebuilding it in another framework.

The user says the game will mostly be played on phones. Judge art, camera framing, text, touch controls and performance on phones first.

## Reference roles

- **Primary visual reference:** the user's attached wedding pixel artwork. Study its crisp pixels, strong colours, recognisable architecture and expressive characters.
- **Place references:** use photos and the floor plan to preserve the house, street and yard's identifying features. Photos guide shapes and layout, not photorealistic rendering.
- **Other pixel-art references:** study shading, material separation, vegetation and animal silhouettes. Do not copy or ship third-party artwork as game assets.
- Adapt references to the game's existing overhead perspective. The wedding artwork's front-facing composition is not itself a replacement game camera.

## Proposed implementation guardrails

- Crisp pixel edges and nearest-neighbour scaling; avoid blurred resampling, glossy illustrated surfaces and excessive detail that disappears on a phone.
- Consistent perspective and lighting across characters, buildings and plants.
- Use a controlled set of shades for each material rather than unrelated palettes for every generated object.
- Preserve recognisable character and pet silhouettes. Check Helen's and Princess's existing replacement sheets before deciding whether either needs redrawing.
- Preserve sprite dimensions, anchors, frame order, collisions and entrances unless an intentional gameplay change requires otherwise.
- Keep touch controls and text readable without obscuring useful objects or exits. Check portrait and landscape rather than assuming one orientation.

## First art pass

Start with a small house exterior and immediate garden comparison. Once the treatment is agreed, extend it to the existing home interior, street and backyard. Do not expand the whole world at once.

Compare results inside the actual game at phone viewport sizes, not only as standalone images. A first comparison should preserve existing gameplay.

## Local reference set

Stored outside the game's public assets at:

`.local/art-references/project-princess/starting-area/`

- `wedding-art.png` — attached primary artwork
- `street-frontage.webp` — house exterior
- `backyard.jpg` — yard and rear architecture
- `floor-plan.jpg` — layout reference
- `renovation-interior.png` — interior with walls removed
- `street-view.png` — immediate street context
- `city-style.jpeg` — pixel-art materials and streetscape reference
- `animal-style.jpeg` — animal silhouettes and shading reference

Drive remains the master reference library. Copy only the references needed for each pass. Do not include personal reference photos in the published game.

# Your sprite art goes here

Drop PNG files into these folders and they replace the built-in pixel art. No code changes needed: the file name decides what it replaces. Push to GitHub and the live game picks them up after the next deploy (about a minute). When playing locally with `node tools/serve.mjs`, just refresh.

**Start from a template.** The `templates/` folder has every built-in sprite exported as a PNG at its real size. Copy one into the matching folder (e.g. `templates/pets/princess.png` to `pets/princess.png`), then edit it in Aseprite, Piskel, Photoshop, Procreate or anything else. The game ignores the `templates/` folder itself.

## Folders and file names

| Folder | File name | Replaces | Size in the game |
|---|---|---|---|
| `pets/` | `<pet id>.png`, e.g. `princess.png` | A pet's walking sprite | One tile tall (16 game pixels) |
| `portraits/` | `<pet id>.png` (or `.jpg`, `.webp`) | The big picture in the Petdex and dialogue. **A real photo of the pet works great here.** | Any size, square is best |
| `player/` | `down.png`, `up.png`, `left.png`, `right.png` | You! `right.png` is optional (otherwise `left.png` is mirrored) | One tile tall |
| `npcs/` | `<person id>.png`, e.g. `gaz.png` | A townsperson (front-facing; mirrored for left and right) | One tile tall |
| `items/` | `<item id>.png`, e.g. `sardine.png` | A treat icon | 12 game pixels |
| `objects/` | `<kind>.png` or `<kind>-<variant>.png` | Trees, houses, signs, etc. `tree.png` replaces every tree, `tree-gum.png` replaces only gum trees | Same width as the template |
| `tiles/` | `<tile name>.png`, e.g. `grass.png` | A ground tile | One tile (16x16 or 32x32 recommended) |
| `vehicles/` | `tram.png`, `train-h.png`, `car-h-red.png`, ... | Trams, trains, cars and bikes | Same size as the template |

Pet ids: `princess`, `salami`, `spooky`, `poppy`, `stanley` (see `src/data/pets.js`).
People ids: `gaz`, `marisol`, `commuter`, `jules`, `busker`, `priya`, `pina`, `dimitri`, `wen`, `kez` (see `src/data/npcs.js`).
Item ids: `chicken`, `sardine`, `carrot`, `cheese`, `snag`, `croissant`, `lemon`, `tennis`, `ribbon`, `feather`.
Tile names: `grass`, `flowers`, `tallgrass`, `path`, `road`, `tram`, `crossing`, `rail`, `footpath`, `concrete`, `platform`, `bluestone`, `water`, `bridge`, `sand`, `soil`, `gravel`, `mulch`.
Object kinds and variants: look at the file names in `templates/objects/`.

## Rules of thumb

- **Characters (pets, player, people) can be animated.** Put the frames side by side in one PNG, each frame a square. A 64x32 PNG is two 32x32 frames. Frame 1 is the standing pose; the rest play as the walk cycle. A single square image works too: it gets a little hop when walking.
- **Draw pets facing right** (or facing the camera). The game mirrors them when they walk left.
- **Pick a resolution and stick to it.** The game shows one tile as 16 game pixels and zooms in to fit the screen. Art drawn at 16x16 per tile matches the built-in look; 32x32 per tile gives you twice the detail and still looks crisp. Both work.
- **Transparent backgrounds** for everything except ground tiles and portraits.
- Keep file names lowercase with no spaces.

## How it works (for the curious)

`manifest.json` in this folder lists the custom files. It is generated automatically by the GitHub Pages workflow and by `tools/serve.mjs`, so you never edit it. If you play the game from some other web server, run `node tools/build-manifest.mjs` first.

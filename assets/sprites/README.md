# Your sprite art goes here

Drop PNG files into these folders and they replace the built-in pixel art. No code changes needed: the file name decides what it replaces. Push to GitHub and the live game picks them up after the next deploy (about a minute). When playing locally with `node tools/serve.mjs`, just refresh.

**Start from a template.** The `templates/` folder has every built-in sprite exported as a PNG at its real size. Copy one into the matching folder (e.g. `templates/pets/princess.png` to `pets/princess.png`), then edit it in Aseprite, Piskel, Photoshop, Procreate or anything else. The game ignores the `templates/` folder itself.

## Folders and file names

| Folder | File name | Replaces | Size in the game |
|---|---|---|---|
| `pets/` | `<pet id>.png`, e.g. `princess.png` | A pet's walking sprite (side-on, facing right) | 16x16 per frame (one tile) |
| `portraits/` | `<pet id>.png` (or `.jpg`, `.webp`) | The big picture in the Petdex and dialogue. **A real photo of the pet works great here.** | Any size, square is best |
| `player/` | `helen-down.png`, `hadrian-left.png`, ... (or plain `down.png` for everyone) | You! Directions: down, up, left, right. Right is optional (left is mirrored) | 16x32 per frame (one tile wide, two tall) |
| `npcs/` | `<person id>.png`, e.g. `trish.png` | A townsperson (front-facing; mirrored for left and right) | 16x32 per frame |
| `items/` | `<item id>.png`, e.g. `sardine.png` | A treat icon | 12 game pixels |
| `objects/` | `<kind>.png` or `<kind>-<variant>.png` | Trees, houses, signs, etc. `tree.png` replaces every tree, `tree-gum.png` replaces only gum trees | Same width as the template |
| `tiles/` | `<tile name>.png`, e.g. `grass.png` | A ground tile | One tile (16x16 or 32x32 recommended) |
| `enemies/` | `<enemy id>.png`, e.g. `bag.png`, `recycling.png` | Things you battle (animals facing right; bins and objects facing the front) | 16x16 (bins 16x20, people 16x32) |
| `vehicles/` | `tram.png`, `train-h.png`, `car-h-red.png`, ... | Trams, trains, cars and bikes | Same size as the template |

Pet ids: `princess`, `salami`, `spooky`, `poppy`, `stanley` (see `src/data/pets.js`). Evolved forms: `pets/princess-evolved.png` (Flamcess), `pets/poppy-evolved.png` (Floppy), and `portraits/<id>-evolved.png`.
Gear icons: `items/gear-lead.png`, `gear-collar`, `gear-harness`, `gear-bell`, `gear-bandana`, `gear-pouch`, `gear-bowtie`.
People ids: `trish`, `gordon`, `gaz`, `marisol`, `commuter`, `pearman`, `jordan`, `abby`, `pina`, `james`, `chris`, `nathan`, `rose`, `slinks`, `mem`, `corni`, `sinead`, `tim`, `nicholas`, `binman`, `hipster`, `golfer`, `stranger`, `olly`, `paddy`, `lesley`, `malcolm`, `kirsty`, `dahlia`, `rayna`, `deanna`, `wren`, `bazza`, `sam`, `sal`, `macca`, `ed` (see `src/data/npcs.js`).
Enemy ids: `bag`, `streetcat`, `dog`, `rat`, `boy`, `balls`, `commuter`, `ibis`, `scooter`, `duck`, `magpie`, `recycling`, `garbage`, `compost`, `alleycat`, `nonna`, `cavoodle`, `ristretto`, `sourdough`, `recordplayer`, `bulldog`, `golfball`, `fiveiron`, `buggy`, `weed`, `ice`, `fentanyl` (see `src/data/enemies.js`).
Item ids: `chicken`, `sardine`, `carrot`, `cheese`, `snag`, `croissant`, `lemon`, `tennis`, `ribbon`, `feather`.
Tile names: `grass`, `flowers`, `tallgrass`, `path`, `road`, `tram`, `crossing`, `rail`, `footpath`, `concrete`, `platform`, `bluestone`, `water`, `bridge`, `sand`, `soil`, `gravel`, `mulch`, `lawn`, `parkgravel`, `zebra`, `carpark`, `driveway`, and indoors `wall`, `timber`, `bathtile`, `carpet`, `lino`, `doorway`.
Object kinds and variants: look at the file names in `templates/objects/`.

## Rules of thumb

- **Characters can be animated.** Put the frames side by side in one PNG. Pet frames are square (a 64x32 PNG is two 32x32 frames). People frames are twice as tall as they are wide, Stardew style (a 48x32 PNG is three 16x32 frames; at double detail, 32x64 per frame). Frame 1 is the standing pose; the rest play as the walk cycle. A single frame works too: it gets a little hop when walking.
- **Draw pets facing right** (or facing the camera). The game mirrors them when they walk left.
- **Pick a resolution and stick to it.** The game shows one tile as 16 game pixels and zooms in to fit the screen. Art drawn at 16 pixels per tile matches the built-in look (and Stardew Valley's); 32 pixels per tile gives you twice the detail and still looks crisp. Both work: the game scales your art to fit each slot.
- **Houses and other big objects** keep the width of their template and anchor at the bottom, so a taller roof or chimney is fine.
- **Transparent backgrounds** for everything except ground tiles and portraits.
- Keep file names lowercase with no spaces.

## How it works (for the curious)

`manifest.json` in this folder lists the custom files. It is generated automatically by the GitHub Pages workflow and by `tools/serve.mjs`, so you never edit it. If you play the game from some other web server, run `node tools/build-manifest.mjs` first.

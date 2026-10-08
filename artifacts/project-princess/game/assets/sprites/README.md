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
| `backgrounds/` | `<zone id>.png`, `<suburb id>.png`, or `default.png` | Battle scenery, without using the Studio | Full scene; 320x180 recommended |

## Draw your own battle backgrounds

Put a complete, opaque PNG in `assets/sprites/backgrounds/`. For example, `laverton.png` replaces Laverton battle scenery, `fleming.png` replaces battles in Fleming Park, and `default.png` is used everywhere without a more specific image. Names are the zone/suburb IDs in `src/world/maps/`. A zone image takes priority over a suburb image, which takes priority over `default.png`. Missing images keep the built-in scenery.

Start at **320x180 pixels** for a pixel-art landscape. Draw the scenery only: the game supplies pets, people, effects and the controls. Leave clear ground around the lower-left quarter for your pet and the middle-right for the opponent. The image fills the area above the battle controls; screen proportions can stretch it, so avoid text and important details at the edges. Optional `laverton-night.png`, `fleming-night.png` or `default-night.png` files are selected at night; otherwise the normal image keeps its original colours.

Commit/upload your PNGs with the game files and deploy normally. The existing manifest generator discovers them automatically; no Studio export or authoring JSON change is needed. With a plain web server, run `node tools/build-manifest.mjs` from the game folder before serving it.

**The template file names are the ids.** Every pet, person, enemy, item, vehicle and object in the game has a template in `templates/` under the name it loads from, so the easiest way to find an id is to look there.

- Pets: `princess`, `salami`, `spooky`, `poppy`, `rusty`, `stanley`, `girlie`, `chloe`, `ziggy`, `emilio` (see `src/data/pets.js`). Evolved forms are `pets/<id>-evolved.png` and `portraits/<id>-evolved.png`: Flamcess, Sopressa, Poltergeist Spooky, Floppy, Even Rustier and Centurionely.
- Player: `helen`, `hadrian` and `aleksy`, each with `-down`, `-up` and `-left`.
- People: over a hundred, in `templates/npcs/` (ids from `src/data/npcs.js` and the suburb files `src/data/north.js`, `east.js` and `summerhill.js`).
- Enemies: in `templates/enemies/` (ids from `src/data/enemies.js` and the suburb files).
- Items: treats, crops, presents, drinks and gear (`gear-lead`, `gear-collar`...) in `templates/items/`.
- Objects: `<kind>-<variant>.png` in `templates/objects/`. `objects/<kind>.png` replaces every variant of that kind. Fences take their style as the variant (`fence-picket.png`, `fence-colorbond.png`...).
- Tile names: `grass`, `flowers`, `tallgrass`, `path`, `road`, `tram`, `crossing`, `rail`, `footpath`, `concrete`, `platform`, `bluestone`, `water`, `bridge`, `sand`, `soil`, `gravel`, `mulch`, `lawn`, `parkgravel`, `zebra`, `carpark`, `driveway`, and indoors `wall`, `timber`, `bathtile`, `carpet`, `lino`, `doorway`.

## Rules of thumb

- **Characters can be animated.** Put the frames side by side in one PNG. Pet frames are square (a 64x32 PNG is two 32x32 frames). People frames are twice as tall as they are wide, Stardew style (a 48x32 PNG is three 16x32 frames; at double detail, 32x64 per frame). Frame 1 is the standing pose; the rest play as the walk cycle. A single frame works too: it gets a little hop when walking.
- **Draw pets facing right** (or facing the camera). The game mirrors them when they walk left.
- **Pick a resolution and stick to it.** The game shows one tile as 16 game pixels and zooms in to fit the screen. Art drawn at 16 pixels per tile matches the built-in look (and Stardew Valley's); 32 pixels per tile gives you twice the detail and still looks crisp. Both work: the game scales your art to fit each slot.
- **Houses and other big objects** keep the width of their template and anchor at the bottom, so a taller roof or chimney is fine.
- **Transparent backgrounds** for everything except ground tiles and portraits.
- Keep file names lowercase with no spaces.

## How it works (for the curious)

### Assign artwork in the developer studio

For a custom pet or character, open its record in the studio and use **Supplied artwork**. Drop your own files into `pets/`, `npcs/` or `portraits/`, then click **Refresh supplied files**. Select an image to preview the sheet's first frame and full sheet, or its portrait, then click **Use previewed artwork**. **Save project** and reload the game to see the assignment. Evolved pets have separate sprite and portrait slots.

Assignments reference files without renaming or overwriting them. The same supplied image can be assigned to more than one custom entity. Built-in records retain their existing file-name workflow. To clear an assignment, select **Automatic file by stable ID / built-in template** and apply it.

The picker rejects missing, corrupt or incompatible files, symlinks, animation and unapplied image orientation. Sprite sheets must contain 1–64 complete frames in a single row: square frames for pets and twice-as-tall frames for characters. Portraits can use any aspect ratio. Files must be no larger than 20 MB or 4096 pixels on either side. Saving revalidates the actual files before changing the authoring document; player save slots are never edited.

`manifest.json` in this folder lists the custom files. It is generated automatically by the GitHub Pages workflow and by `tools/serve.mjs`, so you never edit it. If you play the game from some other web server, run `node tools/build-manifest.mjs` first.


## Adjusting pet sizes

Edit `src/data/pet-sizes.js`. Each number is that pet’s display height in world pixels; a tile is 16 and Helen is 32. For example, Salami starts at 10 and Chloe at 20. Raising a number makes the pet larger in both the world and fights; lowering it makes them smaller. This does not change their stats or collision footprint. Art frames may still be 16x16, 32x32, 64x64 or another square resolution. Keep the feet and standing pose aligned across frames, and keep transparent padding consistent.

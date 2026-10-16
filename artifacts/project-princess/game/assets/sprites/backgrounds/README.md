# Draw your own battle backgrounds

You can paint the scenery behind battles yourself. Save a PNG in this folder with the right name and the game uses it. No code, no Studio.

## Two shapes: phone and desktop

Phones hold the screen upright, computers hold it sideways, so each background can come in two shapes. **The game picks the right one by itself.**

| Shape | Size to draw | Save it as | Example |
| --- | --- | --- | --- |
| Desktop (sideways) | **320 x 180** pixels | `<place>.png` | `laverton.png` |
| Phone (upright) | **192 x 320** pixels | `<place>-phone.png` | `laverton-phone.png` |

You do not have to draw both. If there is only one, the game uses it everywhere: it shrinks it to fit so the pets still stand on your pads, and stretches the edge colours to fill the gaps. It looks best when each screen has its own shape.

Bigger is fine too, as long as it is the same shape: 640 x 360 or 1280 x 720 for desktop, 384 x 640 or 768 x 1280 for phone.

## Where the pets stand

Your pet stands bottom left, the opponent further back on the right. Draw ground (a pad, a patch of grass, a rug) under these spots. The numbers are pixels from the top-left corner of the picture: across, then down.

| | Desktop 320 x 180 | Phone 192 x 320 |
| --- | --- | --- |
| Your pet's feet | 90, 154 | 48, 293 |
| Opponent's feet | 224, 110 | 140, 181 |
| How tall a pet is drawn | about 28 pixels | about 46 pixels |

The pets are always placed exactly on those spots, on every screen size, and they are sized to your picture.

## Things the game puts on top

- **The name boxes.** The opponent's box covers the top-left corner, your pet's box the bottom-right corner. Keep anything important out of those corners.
- **The top may be cut off.** Screens are all slightly different shapes, so the game trims the top of the picture (and on narrow phones, a little off each side) rather than squashing it. The bottom edge always sits right on the battle menu. Keep the top for sky, treetops or roofs. On desktop about the top 45 pixels can go; on phone about the top 44 and 10 down each side.
- The pets, people, effects and menus. Draw scenery only.

## The easy way to start

Everything is in the `templates` folder (the game ignores that folder, so the files there are safe to edit):

- `guide-phone-big.png` and `guide-desktop-big.png`: big pictures with labels showing the feet spots, the name boxes and the parts that may be cut off. Look at these first.
- `guide-phone.png` and `guide-desktop.png`: the same markings on a see-through layer, at the exact drawing size. Put one on a top layer in Procreate or Aseprite, draw underneath, then hide it before you export. Red cross: your pet's feet. Purple cross: the opponent's feet. Dashed box: the space a pet fills. Blue stripes: name boxes. Yellow: may be cut off.
- Starter pictures to paint over: `laverton.png`, `brunswick.png`, `reservoir.png` (desktop) and `laverton-phone.png`, `brunswick-phone.png`, `reservoir-phone.png` (phone), each with a `-night` version.

To use one: copy it out of `templates` into this folder (the `backgrounds` folder itself), repaint it, and keep the name.

## File names

`<place>` is a zone or a suburb:

- A zone, for one spot: `fleming.png` (Fleming Park), `allen.png` (Allen St). Zone names are the file names in `src/world/maps/`.
- A suburb, for everywhere in it: `laverton.png`, `brunswick.png`, `reservoir.png`, `brunswickeast.png`, `coburg.png`, `preston.png`, `carlton.png`, `city.png`.
- `default.png`: everywhere without its own picture.
- `exhibition.png`: the dog show ring.

A zone picture beats a suburb picture, which beats `default.png`. With no picture at all, the game draws its own scenery as before.

**Night versions** (optional): add `-night` before `-phone`.

| | Day | Night |
| --- | --- | --- |
| Desktop | `laverton.png` | `laverton-night.png` |
| Phone | `laverton-phone.png` | `laverton-night-phone.png` |

Without a night picture the day one is used at night, in its own colours.

Use lowercase names with no spaces, and save as PNG. Upload the files with the game and deploy as usual; the game finds them by itself.

# Project Princess

A cosy, Stardew Valley meets Pokémon style pet-collecting game set in Melbourne. You wander three suburbs (Laverton, Brunswick, Reservoir) finding, befriending and cataloguing the real pets of the owner's friends. It runs in any browser, works on phones, and is shared with friends as a GitHub Pages link.

The pets are real animals belonging to real people (their owners are named in `src/data/pets.js`). Keep their portrayal affectionate, funny and kind. The humour is gentle Melbourne in-jokes: trams, myki, level crossing removals, Bunnings-style sausage sizzles, nonnas with lemon trees, rent prices.

## Writing style for in-game text and docs

- Australian English spelling (colour, neighbour, defence, favourite, organise).
- No em dashes. Use full stops, commas or colons instead.
- Short, punchy lines. Dialogue boxes are small on phones: aim for under about 140 characters per line.

## Running it

No build step and no npm install. Phaser 3.90 is vendored in `lib/phaser.min.js` and loaded as a global; the game code is native ES modules.

```sh
node tools/serve.mjs          # http://localhost:8080 (phones on the same wifi: http://<computer IP>:8080)
```

ES modules need a web server; opening `index.html` from the file system will not work. `tools/serve.mjs` also serves a live `assets/sprites/manifest.json`, so new custom PNGs appear on refresh.

Handy in the browser console: `__pp.state.data` (the save), `__pp.game.scene.getScene('World')` (the current scene). For example `__pp.state.data.minutes = 22*60` jumps to 10pm.

### Testing

There is no test suite yet. Verify changes by driving the game in headless Chromium with Playwright (Chromium lives at `/opt/pw-browsers/chromium` in cloud sessions). Useful patterns:

- Wait for `window.__pp.game.scene.getScene('World').player` before interacting.
- Teleport: `scene.player.body.reset(x, y)`. Restart in a region: `scene.scene.restart({ region: 'brunswick', entry: 'station' })`.
- Close dialogue by pressing Space until `#dialog` is hidden.
- Headless rendering is slow (about 30 fps) and Phaser caps the frame delta, so movement and the clock run slower than real time. Use `waitForFunction` on game state rather than fixed timeouts.
- A reachability check (BFS over `getMap(id).solid` from each entry) is a quick way to confirm map edits did not wall anything off. `src/data/regions.js` and the map files import cleanly in Node.

## Deploying

`.github/workflows/pages.yml` deploys on every push to `main`: it generates the sprite manifest, copies the site into `_site` (minus sprite templates) and publishes it with the official Pages actions. One-off repo setting: Settings > Pages > Source: GitHub Actions. Pages on a private repo needs a paid GitHub plan; otherwise the repo must be public.

## Architecture

```
index.html            HTML shell: HUD, dialogue box, touch controls, modal container
style.css             All interface styles (wood and parchment look)
lib/phaser.min.js     Phaser 3.90 (vendored, global `Phaser`)
src/
  main.js             Boots state, controls, UI, then Phaser (Boot -> World scenes)
  config.js           Tuning numbers: speeds, clock, friendship points, save key
  bus.js              Tiny event bus shared by scenes and the HTML UI
  util.js             hash() noise, seeded rng(), pick/clamp/lerp
  data/               CONTENT. Most edits happen here.
    pets.js           The pets: stats, behaviours, favourite treats, dialogue by heart level
    npcs.js           Townsfolk: lines, hints about unfound pets, daily gifts
    items.js          Treats
    types.js          Pet types with colours (and planned battle matchups)
    regions.js        Region list, grass palettes, map builder lookup, getMap() cache
    flavour.js        Text for inspecting objects (houses, bins, trams...)
  world/
    MapBuilder.js     DSL for building maps in code (fill, put, scatter, exits, lanes...)
    maps/*.js         One file per suburb. Ground letters + objects + spawns + NPC spots
    entities.js       Player, Pet (behaviour AI), Npc. Arcade physics sprites
    traffic.js        Cars, trams, bikes, trains (scenery that waits for you)
  art/
    sprites.js        Built-in character pixel art as strings
    paint/*.js        Procedural painters: ground tiles, objects, items, effects, vehicles
    textures.js       Builds textures; swaps in custom PNGs from assets/sprites via the manifest
  scenes/
    BootScene.js      Loads the sprite manifest and custom PNGs, builds textures
    WorldScene.js     The game: builds a region, input, interactions, clock, lighting, rain, exits
  systems/
    state.js          The save (localStorage), legacy migration, save codes, weather per day
    controls.js       Keyboard + floating joystick + A/B buttons -> movement vector and bus events
    clock.js          Time labels, darkness curve, night checks
    sfx.js            Synthesised WebAudio blips (no audio files)
  ui/                 HTML interface: ui.js (HUD, dialogue, banner, toasts, modals), petdex.js, bag.js, menu.js
assets/sprites/       Custom art drop zone (see its README). templates/ has every built-in sprite as PNG
tools/                serve.mjs (dev server), build-manifest.mjs (used by the deploy workflow)
archive/prototype.html  The original single-file canvas prototype, kept for reference
```

### Key conventions

- **Coordinates.** Maps are in tiles (16 world pixels). Data files use tile coordinates; `toWorld(tx, ty)` in `entities.js` converts to the world position of a character's feet (`(tx + 0.5) * 16, (ty + 0.75) * 16`).
- **Depth sorting.** Everything that stands on the ground has origin (0.5, 1) and `depth = y` (its feet or footprint bottom). Night overlay is depth 9000, light glows 9001, rain 9002, bubbles 9500+.
- **Maps** are built in code by `MapBuilder`, deterministically (seeded), and cached by `getMap()`. Ground letters are documented at the top of `src/art/paint/tiles.js`. Collision comes from solid ground (`~` water, `r` rail) plus object footprints, and is fed to an invisible Phaser tilemap layer for Arcade physics.
- **Objects** are defined in `src/art/paint/objects.js` (`foot` = blocking footprint in tiles, `tex` = texture size, anchored bottom-centre on the footprint). Fences auto-join with neighbours.
- **Textures and custom art.** Built-in textures are painted onto canvases at startup (`textures.js`). Keys: `player-<dir>`, `pet-<id>`, `npc-<id>-<dir>` (or `npc-<id>` for custom), `item-<id>`, `obj-<kind>-<variant>`, `tile-<name>`, `veh-<name>`, `portrait-<id>`. A PNG at `assets/sprites/<folder>/<name>.png` loads as `<prefix>-<name>` and wins over the built-in. Character PNGs are split into square frames. Always size sprites through `fitScale()` so custom art of any resolution fits its slot.
- **UI is HTML, not canvas**, for crisp text on phones. Scenes talk to it through `ui` (`ui.say(lines, { name, portrait })` returns a promise resolving to the picked choice) and the `bus`.
- **Saving.** `state.data` is the whole save. It is sanitised on load, so adding a field means adding a default in `fresh()` and copying it in `sanitise()`. Bump `VERSION` and add a migration if the shape changes incompatibly. The prototype's old save (`whisker-hollow-v2`) is migrated automatically.
- **Time.** The day runs 6am to 2am (`DAY_START`/`DAY_END`), 10 game minutes per 7 real seconds, paused while any dialogue or menu is open. At 2am the day ends and you wake at the station. Rain is decided per day from the day number (`state.rainWindow`), so it is stable across reloads.
- **Pets** have one chat per day (+friendship) and one treat per day (love/like/neutral/dislike). 25 points per heart, 10 hearts. Lines unlock by heart level. Behaviours live in `Pet.think()`: `patrol` (Princess), `stalk` (Salami), `phase` (Spooky teleports, solid at night), `zoomies` (Poppy charges and bonks), `aloof` (Stanley walks away until 3 hearts, approaches at 6). Pets can sleep on a schedule.

### Adding content

- **A pet:** add an entry to `PETS` (pick a `sprite` from `PET_FRAMES` or add a new one in `sprites.js`), set `region` and a walkable `home`. Check reachability. Optional art: `assets/sprites/pets/<id>.png` and `portraits/<id>.png`.
- **A townsperson:** add to `NPCS`, then place them in a map with `b.npc(id, x, y, { face, path })`.
- **A treat:** add to `ITEMS` and `ITEM_ART`, then list it in forage spawns (`b.forage`) or an NPC `gift`, and in pets' loves/likes.
- **A region:** write `src/world/maps/<id>.js` (copy an existing one), register it in `regions.js` and `REGION_ORDER`, add its name to the allowed list in `state.js` `sanitise()`, give it a `station` entry and myki reader, and connect it with `b.exit(...)` on both sides. The locked exits (Werribee, the city, Coburg North, Plenty Rd) are ready-made hooks for new regions.

## Future plans

Roughly in the order they build on each other. The groundwork noted for each already exists.

### 1. Types (expand and make them matter)
- Groundwork: `src/data/types.js` has five types with colours and draft `strong`/`weak` lists.
- Plan: finalise a matchup chart (keep it small and readable, maybe 6 to 8 types). Candidate additions that fit the cast and Melbourne: Water (Merri Creek, the bay), Electric (trams), Bird (magpies, ibis). Show matchups in the Petdex type note.

### 2. Battles
- Groundwork: every pet has `stats` (hp, attack, defence, speed, special) and four named `moves` shown in the Petdex as "coming soon". The HTML dialogue system supports choice menus, which a battle menu can reuse.
- Plan: a separate `BattleScene` launched over the world (pause `World`, `scene.launch('Battle')`). Turn-based, Pokémon-lite: the player's party is the pets they have befriended (perhaps 3+ hearts to join). Each move gets a type, power and a funny description in a new `src/data/moves.js`. Friendship should matter (crit chance or a "refuses to lose" save at high hearts). Keep it kind: battles are play-fights, nobody faints, they "get the zoomies out" or "need a nap".
- Keep phone controls in mind: big buttons, no timing pressure.

### 3. Region enemies (wild encounters)
- Groundwork: tall grass (`"` ground tiles) already exists in every region and draws a grass tuft over the feet of whoever walks through it. The locked exits mark where tougher areas could go.
- Plan: random encounters in tall grass, with region-flavoured "enemies" defined in `src/data/enemies.js`. Ideas:
  - Laverton: Feral Pigeon, Night Fox, Hoon in a Commodore (boss, Aviation Rd at night).
  - Brunswick: Bin Chicken (ibis), E-scooter Menace, Rat King of Sydney Rd (boss, laneways).
  - Reservoir: Rogue Duck, Swooping Magpie (spring only), Boom Gate (boss at the level crossing).
  - Anywhere: the Myki Inspector (wandering mini-boss who checks if you touched on).
- Magpies already hop around each map; swooping season could make them hostile in spring.

### 4. Evolutions
- Plan: friendship-driven rather than level-driven, to suit the cosy tone. At 10 hearts plus a condition (time of day, a loved item, a location), a pet gains a new form: new sprite, title and boosted stats. Ideas: Princess to Empress Princess (crown), Spooky to Poltergeist Spooky, Poppy to Wrecking Ball Poppy, Stanley to Professor Stanley, Salami to Sopressa (the elder salami). Store as `evolvesTo` data on the pet and an `evolved` flag in the save. Custom art: `pets/<id>-evolved.png`.

### 5. Farming
- Groundwork: the Reservoir Community Garden already has tilled soil (`d` tiles), decorative crops and a gardener NPC (Wen) who talks about plots opening soon. The day clock, daily resets and the bag all exist.
- Plan: let the player claim a plot, plant seeds (bought or gifted), water daily, harvest after N days. Crops become treats pets love (carrots for Spooky) and battle items later. Seasons would follow (Melbourne gets all four in a day, which is a joke worth keeping). Possibly a small home garden or balcony pots in Brunswick.

### Smaller ideas
- More pets and regions (the locked exits), quests from townsfolk, a photo mode, music, achievements (all pets found, 10 hearts with everyone).
- Tiled map support: the builder could also accept Tiled JSON exports if hand-editing maps becomes easier than code.
- A service worker for offline play (be careful with cache invalidation on updates).

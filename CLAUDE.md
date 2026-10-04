# Project Princess

A cosy, Stardew Valley meets Pokémon style pet-collecting game set in Melbourne. You live at Helen and Paddy's new house on Allen St, Laverton, and wander three suburbs (Laverton, Brunswick, Reservoir) finding, befriending and cataloguing the real pets of the owner's friends. Found pets move into your house; each time you leave you pick a team of up to three who follow you around. It runs in any browser, works on phones, and is shared with friends as a GitHub Pages link.

Laverton is modelled on real places from the owner's screenshots: the Allen St house (floor plan and backyard from the real estate listing, walls between kitchen, meals and lounge removed), the Allen St cul-de-sac, Woods St (the old house at 72, where Helen's parents Trish and Gordon now live), Lohse St Reserve and Laverton Station. Brunswick has four zones from the owner's screenshots: Brunswick Station (heritage building, Upfield path, Dawson St level crossing), Sydney Rd (A1 Bakery, Spooky's spot), Donald St (south off Sydney Rd: Rose's blue-grey flats, Salami's spot) and Hope St (Mem and Corni's apartments). Brunswick is deliberately concrete and industrial: bluestone laneways, roller doors, sawtooth factories, graffiti, barely any grass. Its jokes are the shopfronts (INK & IRONY tattoos, OAT CUISINE, BRAKE FAST in an old mechanic's), drawn as `bshop`/`factory`/`garagecafe` variants in `brunswick.js`. Reservoir has Reservoir Station (the skyrail; trains run on top with lane `sky: true`), Loddon Ave (Seb and Sinead's block of five brick units off Plenty Rd, Poppy's spot) and Glasgow Ave (Tim and Nick's at 57C, Stanley's spot). Edwardes Lake Park is four zones joined in a loop so it is easy to wander and get lost: `track` (athletics oval, Little Athletics clubhouse), `lake` (the lake, tussocks, Edwardes St railing, outdoor gym), `lakepark` (A2 964 steam engine, pink slide playground, Griffiths St) and `wetlands` (Edgars Creek, scout hall, community garden). Every zone has tall grass patches ready for wild encounters. Glasgow Ave also has the Botha Ave roundabout with its yarn-bombed gum. Recreate real places recognisably but compressed. Avoid real business names on shopfronts, except A1 Bakery, which the owner specifically asked for.

**Battles.** Pokémon-style play-fights with 11 types. Wild things jump out of tall grass; pet owners and the Bin Man battle you when you talk to them. You win each pet (except Princess, who is free) by beating their owner.

**Who you play.** At the start you choose Helen or one of her twin toddlers, Hadrian and Aleksy (`src/data/heroes.js`). Each has a perk (`talkBonus`, `runBoost`, `forageBonus`) and starting treats. The choice is saved as `state.data.hero` and can be changed from the menu; older saves are asked once.

**Art direction.** The owner plans to draw the final art. The built-in art is code-drawn reference art in a Stardew style: 16px tiles, people 16x32, pets 16x16 side-on, 1px dark outline, shaded with a light top edge and darker bottom/right. Keep new built-in art consistent with that so custom PNGs can drop straight in. People are drawn from a `look` in `people.js`; the cast's looks come from the owner's photos (patterns like plaid and leopard, sunglasses, hoops, blazers, held toys and more are all look options documented at the top of that file).

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
    heroes.js         Playable characters (Helen, Hadrian, Aleksy): looks, perks, starting treats
    pets.js           The pets: stats, behaviours, favourite treats, dialogue by heart level
    npcs.js           Townsfolk: lines, hints about unfound pets, daily gifts
    items.js          Treats
    types.js          The 11 battle types, matchup chart (strong/resist), effectiveness()
    moves.js          Every battle move (type, power, effect, animation, text) and PET_MOVES
    enemies.js        Wild things, the Bin Man's bins, ENCOUNTERS per suburb, TRAINERS (owners)
    regions.js        SUBURBS and ZONES (each zone is one map), grass palettes, getMap() cache
    flavour.js        Text for inspecting objects (houses, bins, trams...)
  world/
    MapBuilder.js     DSL for building maps in code (fill, put, scatter, exits, lanes...)
    maps/*.js         One file per zone: home, yard, allen, woods, lohse, station (Laverton); brunswick (station), sydney, donald, hope (Brunswick); resstation (zone id `reservoir`), loddon, glasgow, track, lake, lakepark, wetlands (Reservoir)
    entities.js       Player, Pet (behaviour AI), Npc. Arcade physics sprites
    traffic.js        Cars, trams, bikes, trains (scenery that waits for you)
  art/
    sprites.js        Built-in character pixel art as strings
    paint/*.js        Procedural painters: enemies.js (battle foes), tiles (ground + interior walls/floors), objects (+ furniture.js, laverton.js), people.js (16x32 people and toddlers from a "look"), brunswick.js, items, fx
    textures.js       Builds textures; swaps in custom PNGs from assets/sprites via the manifest
  scenes/
    BootScene.js      Loads the sprite manifest and custom PNGs, builds textures
    WorldScene.js     The game: builds a region, input, interactions, clock, lighting, rain, exits, encounters
    BattleScene.js    Battles: backdrop, fighters, move animations, the turn loop
  systems/
    state.js          The save (localStorage), legacy migration, save codes, weather per day
    controls.js       Keyboard + floating joystick + A/B buttons -> movement vector and bus events
    clock.js          Time labels, darkness curve, night checks
    battle.js         Battle rules: levels, stats, damage, enemy AI, XP, run chance
    sfx.js            Synthesised WebAudio blips (no audio files)
  ui/                 HTML interface: ui.js (HUD, dialogue, banner, toasts, modals), battle.js (battle boxes, messages, menus), petdex.js, bag.js, menu.js, team.js, hero.js
assets/sprites/       Custom art drop zone (see its README). templates/ has every built-in sprite as PNG
tools/                serve.mjs (dev server), build-manifest.mjs (used by the deploy workflow)
archive/prototype.html  The original single-file canvas prototype, kept for reference
```

### Key conventions

- **Coordinates.** Maps are in tiles (16 world pixels). Data files use tile coordinates; `toWorld(tx, ty)` in `entities.js` converts to the world position of a character's feet (`(tx + 0.5) * 16, (ty + 0.75) * 16`).
- **Depth sorting.** Everything that stands on the ground has origin (0.5, 1) and `depth = y` (its feet or footprint bottom). Night overlay is depth 9000, light glows 9001, rain 9002, bubbles 9500+.
- **Maps** are built in code by `MapBuilder`, deterministically (seeded), and cached by `getMap()`. Ground letters are documented at the top of `src/art/paint/tiles.js`. Collision comes from solid ground (`~` water, `r` rail) plus object footprints, and is fed to an invisible Phaser tilemap layer for Arcade physics.
- **Zones and suburbs.** `state.data.region` holds the current zone id. Zones belong to a suburb; the HUD shows "Zone, Suburb". Exits link zones by entry name. Walking between zones in the same suburb costs 3 game minutes; between suburbs 20; the train 25. The myki reader lists suburbs you've visited and drops you at that suburb's `station` zone. `home: true` zones (home, yard) are your place; `indoor: true` dims the night overlay and hides rain.
- **Interiors** use ground letters `W` (wall; draws as wallpaper face when floor is below, a 2-tall top wall gets an upper face), `V` (void), `D` (doorway), and floors `o` `T` `K` `n`. Doors are exits on `D` tiles. Wall decorations use `put(..., { onWall: true })`.
- **Objects** are defined in `src/art/paint/objects.js` plus `furniture.js` and `laverton.js` (`foot` = blocking footprint in tiles, `tex` = texture size, anchored bottom-centre on the footprint). Flags: `flat` (rugs, mats: drawn under everything, can overlap), `roof` (carports, canopies: drawn over characters and fade when you walk under), `deck` (the footbridge: drawn over trains but under people; put walkable `B` rail tiles underneath and give train lanes `under: true`). Fences auto-join with neighbours; styles picket, colorbond, park, paling, metal.
- **Team.** `state.data.party` (max 3) holds pets following you. Exits with `{ team: true }` (front door, side gate) open the team picker when you have pets. Pets spawn per zone in one of three modes (`Pet` in entities.js): `follow` (on your team, trails behind you on `scene.trail`), `home` (found, not on the team, at `pet.homeSpot` in the home or yard zone), or `wild` (not on the team, in `pet.zone`). A pet on your team is never also in its wild zone.
- **Textures and custom art.** Built-in textures are painted onto canvases at startup (`textures.js`). Keys: `player-<hero>-<dir>` (custom `player-<dir>` applies to everyone), `pet-<id>`, `npc-<id>-<dir>` (or `npc-<id>` for custom), `item-<id>`, `obj-<kind>-<variant>`, `tile-<name>`, `veh-<name>`, `portrait-<id>`. A PNG at `assets/sprites/<folder>/<name>.png` loads as `<prefix>-<name>` and wins over the built-in. Character PNGs are split into square frames. Always size sprites through `fitScale()` so custom art of any resolution fits its slot.
- **UI is HTML, not canvas**, for crisp text on phones. Scenes talk to it through `ui` (`ui.say(lines, { name, portrait })` returns a promise resolving to the picked choice) and the `bus`.
- **Saving.** `state.data` is the whole save. It is sanitised on load, so adding a field means adding a default in `fresh()` and copying it in `sanitise()`. Bump `VERSION` and add a migration if the shape changes incompatibly. The prototype's old save (`whisker-hollow-v2`) is migrated automatically.
- **Time.** The day runs 6am to 2am (`DAY_START`/`DAY_END`), 10 game minutes per 7 real seconds, paused while any dialogue or menu is open. At 2am the day ends and you wake up in bed at home. Rain is decided per day from the day number (`state.rainWindow`), so it is stable across reloads.
- **Pets** have one chat per day (+friendship) and one treat per day (love/like/neutral/dislike). 25 points per heart, 10 hearts. Lines unlock by heart level. Behaviours live in `Pet.think()`: `patrol` (Princess), `stalk` (Salami), `phase` (Spooky teleports, solid at night), `zoomies` (Poppy charges and bonks), `aloof` (Stanley walks away until 3 hearts, approaches at 6). Pets can sleep on a schedule.

### Adding content

- **A pet:** add an entry to `PETS` (pick a `sprite` from `PET_FRAMES` or add a new one in `sprites.js`), set `region` (suburb), `zone`, a walkable `home` in that zone and a `homeSpot` at your place (add a pet bed there). Check reachability. Optional art: `assets/sprites/pets/<id>.png` and `portraits/<id>.png`.
- **A townsperson:** add to `NPCS`, then place them in a map with `b.npc(id, x, y, { face, path })`.
- **A treat:** add to `ITEMS` and `ITEM_ART`, then list it in forage spawns (`b.forage`) or an NPC `gift`, and in pets' loves/likes.
- **A zone:** write `src/world/maps/<id>.js` (copy a similar one), register it in `ZONES` in `regions.js`, and connect it with `b.exit(...)` and `b.entry(...)` on both sides. Run the reachability check.
- **A suburb:** add it to `SUBURBS`/`SUBURB_ORDER` with a `station` zone containing a myki reader (`put('myki', x, y, { travel: true })`) and a `station` entry. The locked exits (the city, Coburg North, Plenty Rd) are ready-made hooks.
- **A wild enemy:** add to `ENEMIES` (stats, type, moves from `MOVES`, `appear`/`leave` lines, optional `held` snack and `drop`), art in `FOE_ART` (`src/art/paint/enemies.js`), and list it in `ENCOUNTERS` for a suburb with a level range.
- **A trainer:** add an NPC, then a `TRAINERS` entry keyed by the NPC id with a `team` of `[enemyId or 'pet:<id>', level]`. Give it a `prize` pet to make it the way you win that pet.
- **A move:** add to `MOVES` with a type, power, optional `effect` and one of the `anim` names handled in `BattleScene.play()`.

### Battles

- Battles are play-fights: nobody faints. A foe "has had enough"; your pet "runs home to Allen St". Keep that tone.
- **Wild encounters:** each new tall-grass tile (`"`) you step on has an `ENCOUNTER_RATE` chance (config.js), only if your team has a pet with energy, never at home, and not within 6 tiles of the last battle. `b.wildGrass(cx, cy)` in a map adds a patch (only over lawn). Every outdoor zone has some.
- **Trainers:** talking to an NPC in `TRAINERS` offers a battle. Owners (Rose, Slinks, Sinead, Tim) battle with their pet; win and the pet is found (`winPet`). Talking to an un-won pet points you to its owner. Princess has no owner trainer: talking to her finds her. The Bin Man (Woods St) can be rebattled, rewards once a day; `state.data.beaten[npcId]` is the day you last beat them.
- **Flow:** `WorldScene.startBattle(opts)` flashes the screen, pauses World and launches `Battle` with a `done(result)` callback (`outcome`: win, lose, run, forfeit). `ui.blocking()` is true throughout. The battle menu is HTML (`#battle`, `src/ui/battle.js`); A/Space, B/Esc and arrows are routed to it.
- **Rules** (`src/systems/battle.js`): Pokémon-lite. Stats scale with level from the pet's base `stats`. Fairy, ghost and psychic moves use `special`. Same-type bonus 1.5x, effectiveness 2x or 0.5x, stat stages, dodge moves go first and can't be chained, Charge doubles the next hit, Chew wrecks a foe's held snack. Friendship matters: crit chance rises with hearts, and at 6+ hearts a pet may refuse to lose (hangs on at 1 HP). Treats heal in battle by how much the pet likes them.
- **Save:** each pet record has `level` (0 = use `START_LEVEL`), `xp` and `hp` (null = full, 0 = ran home). A pet that runs home leaves the party. Entering a `home` zone heals everyone (`state.healAll()`). Losing sends you home.
- Custom battle art: `assets/sprites/enemies/<id>.png` (texture `foe-<id>`); pets use their normal sprite.

## Future plans

Roughly in the order they build on each other. The groundwork noted for each already exists.

### Done: types, battles, wild encounters
- 11 types (Rock, Fairy, Fire, Street, Ghost, Psychic, Smelly, Old, Plastic, Steel, Leather), each pet's four moves as the owner asked, Laverton/Brunswick/Reservoir wild things, the Bin Man, and owner battles to win pets. See **Battles** above.
- Ideas still open: a Rat King of Sydney Rd boss in the laneways, a Boom Gate boss at a level crossing, the Myki Inspector as a wandering mini-boss, a Hoon in a Commodore on Aviation Rd at night, magpies only swooping in spring, battle music.

### 1. Evolutions
- Plan: friendship-driven rather than level-driven, to suit the cosy tone. At 10 hearts plus a condition (time of day, a loved item, a location), a pet gains a new form: new sprite, title and boosted stats. Ideas: Princess to Empress Princess (crown), Spooky to Poltergeist Spooky, Poppy to Wrecking Ball Poppy, Stanley to Professor Stanley, Salami to Sopressa (the elder salami). Store as `evolvesTo` data on the pet and an `evolved` flag in the save. Custom art: `pets/<id>-evolved.png`.

### 2. Farming
- Groundwork: the Reservoir Community Garden already has tilled soil (`d` tiles), decorative crops and a gardener NPC (Wen) who talks about plots opening soon. The day clock, daily resets and the bag all exist.
- Plan: let the player claim a plot, plant seeds (bought or gifted), water daily, harvest after N days. Crops become treats pets love (carrots for Spooky) and battle items later. Seasons would follow (Melbourne gets all four in a day, which is a joke worth keeping). Possibly a small home garden or balcony pots in Brunswick.

### Next up (agreed with the owner)
- Balance battles after the owner plays them (levels in `TRAINERS`/`ENCOUNTERS`, `ENCOUNTER_RATE`). More spots in any suburb as the owner sends photos.
- Extra Laverton spots and shops, once the core zones feel right.
- Real pet photos as Petdex portraits (`assets/sprites/portraits/`), and the owner's own sprite art replacing the built-in reference art.

### Smaller ideas
- More pets and regions (the locked exits), quests from townsfolk, a photo mode, music, achievements (all pets found, 10 hearts with everyone).
- Tiled map support: the builder could also accept Tiled JSON exports if hand-editing maps becomes easier than code.
- A service worker for offline play (be careful with cache invalidation on updates).

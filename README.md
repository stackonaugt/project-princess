# Project Princess

A cosy pet-collecting adventure across Melbourne. Explore Laverton (home, Allen St, Woods St, Lohse St Reserve and the station), Brunswick and Reservoir, find your friends' pets, become their best mate, and fill your Petdex.

**Play:** https://stackonaugt.github.io/project-princess/ On a phone, use your browser's "Add to Home Screen" for a full-screen app.

## How to play

- You live at Helen and Paddy's new place on Allen St, Laverton (mid-renovation). Head out the front door to start exploring.
- Find the five pets: Princess, Salami, Spooky, Poppy and Stanley. Princess is free; for the others, find their owner and win a friendly play-fight. Once you have a pet, it comes to live at your place.
- Each time you leave the house, pick up to three pets for your team. They follow you around. Pets you leave behind relax at home, or wander their usual patch.
- Press **A** (or Space) next to a pet, person or sign to talk.
- Chat with each pet once a day, and give them one treat a day. Find out what they love.
- Treats appear around town each morning, and some locals hand them out too.
- **Battles:** with pets on your team, wild things jump out of tall grass (plastic bags, street cats, bin chickens, angry commuters...). Fifteen types (Water, Park, Caffeine and Booze are the newest): pick moves that suit their type, toss treats to give energy back. A pet who has had enough runs home; everyone rests up at home. Fancy a challenge? Find the Bin Man on Woods St.
- **Money and the pet shop:** battles earn a little money. Spend it at The Leash You Can Do, Ed's pet shop on Hope St, Brunswick: treats, plus gear like leads, collars and bow ties that you put on your pets (from the Bag) for a boost in battles.
- **Evolutions:** level a pet up AND become close friends and something may happen. Princess and Poppy have surprises in store.
- **The long walk:** you can walk from Laverton to Brunswick to Reservoir through Altona North, Footscray, Flemington, Coburg and Preston. Or tap your myki.
- Tap your **myki** at a station to catch the train to suburbs you have already visited.
- **Your Pawphone** (Phone button, or M) has everything: Petdex, Bag, Friends, a Map of the whole route, your Garden and Settings. Three save slots live on the title screen.
- **Friends:** chat to townsfolk every day and bring them gifts. Each heart unlocks a little scene, and good friends sometimes turn up to help when you battle near where they live. Buy presents: books and flowers at Dimitri's milk bar, plants at Bunnings, and beer and wine at the Edinburgh Castle bottle shop on Sydney Rd (for friends, never for pets).
- **Farming:** Wen at the Edgars Creek community garden gives you plots and seeds. Water once a day (rain counts), pick when ripe, sell at Dimitri's milk bar. Your pets help.
- **House upgrades and garden tools:** Olly at Bunnings Warehouse in Altona North sells seeds, a long hose, a sprinkler, fertiliser and house upgrades: a backyard veggie patch, a pet door, finishing the twins' room and a paddling pool.
- Tired? Use your bed at home to sleep until morning, or have a nap to rest your pets.
- The clock is ticking: there is day and night, Melbourne showers, and some pets keep odd hours.

**Phone:** drag on the left side of the screen to walk (push all the way, or hold B, to run). Tap A to talk. You can also tap a pet or a spot on the map to walk there.
**Keyboard:** arrows or WASD, Shift to run, Space to talk, P for the Petdex, B for the bag, M for the menu.

Your progress saves automatically on each device. Settings > Delete this slot starts that slot again from scratch. To move it to another device: Phone > Settings > Copy save code, then Load save code on the other one.

## Add your own art

Drop PNGs into `assets/sprites/` and they replace the built-in pixel art: `assets/sprites/pets/princess.png` replaces Princess, `assets/sprites/portraits/princess.jpg` puts a real photo in her Petdex page. Full guide and ready-made templates: [assets/sprites/README.md](assets/sprites/README.md).

## Run it on your computer

You need [Node.js](https://nodejs.org) (any recent version). No installs.

```sh
node tools/serve.mjs
```

Then open http://localhost:8080.

## Share it with friends (GitHub Pages)

1. On GitHub, go to the repo's **Settings > Pages**.
2. Under **Build and deployment > Source**, choose **GitHub Actions**.
3. Push to `main` (or run the "Deploy to GitHub Pages" workflow from the Actions tab). After a minute or so the link appears on the Pages settings screen.

Note: GitHub Pages only works on **public** repos with a free account. A private repo needs GitHub Pro (and even then, the published site is public).

## Making changes

Most fun edits are in `src/data/` (pets, people, treats) and `src/world/maps/` (the suburbs). `CLAUDE.md` explains how everything fits together and how battles work, and what is planned next: evolutions and farming.

Built with [Phaser 3](https://phaser.io). The pets belong to their humans.

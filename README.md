# Project Princess

A cosy pet-collecting adventure across Melbourne. Explore Laverton, Brunswick and Reservoir, find your friends' pets, become their best mate, and fill your Petdex.

**Play:** once GitHub Pages is switched on, the game lives at `https://<your-github-username>.github.io/project-princess/`. On a phone, use your browser's "Add to Home Screen" for a full-screen app.

## How to play

- Walk around and find the five pets: Princess, Salami, Spooky, Poppy and Stanley.
- Press **A** (or Space) next to a pet, person or sign to talk.
- Chat with each pet once a day, and give them one treat a day. Find out what they love.
- Treats appear around town each morning, and some locals hand them out too.
- Tap your **myki** at a station to catch the train to suburbs you have already visited.
- The clock is ticking: there is day and night, Melbourne showers, and some pets keep odd hours.

**Phone:** drag on the left side of the screen to walk (push all the way, or hold B, to run). Tap A to talk. You can also tap a pet or a spot on the map to walk there.
**Keyboard:** arrows or WASD, Shift to run, Space to talk, P for the Petdex, B for the bag, M for the menu.

Your progress saves automatically on each device. To move it to another device: Menu > Copy save code, then Menu > Load save code on the other one.

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

Most fun edits are in `src/data/` (pets, people, treats) and `src/world/maps/` (the suburbs). `CLAUDE.md` explains how everything fits together and what is planned next: battles, types, region enemies, evolutions and farming.

Built with [Phaser 3](https://phaser.io). The pets belong to their humans.

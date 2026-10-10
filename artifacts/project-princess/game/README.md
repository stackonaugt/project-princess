# Project Princess

A cosy pet-collecting adventure across Melbourne's north and west. You live with Helen, Paddy and the twins in their half-renovated house on Allen St, Laverton. Wander from Laverton to Reservoir and into the city, find your friends' pets, win them over, battle wild things in the tall grass, help Paddy survive council, and throw the party of the year.

**Play:** https://stackonaugt.github.io/project-princess/ On a phone, use your browser's "Add to Home Screen" for a full-screen app.

## Controls

**Phone:** drag on the left side of the screen to walk (push all the way, or hold B, to run). Tap A to talk, check, sit or fish. You can also tap a pet or a spot on the map to walk there.
**Keyboard:** arrows or WASD to walk, Shift to run, Space to talk, P for the Petdex, B for the Bag, M for the Pawphone.

Your progress saves automatically on each device, in one of three save slots on the title screen. To move a save to another device: Pawphone > Settings > Copy save code, then Load save code on the other one.

Reloading the same browser tab resumes its active save. Use the game's return-to-title
action when you want to choose another slot.

## Where you can go

The world is one long walk, with trains and trams to skip ahead to places you have already been.

- **Laverton:** home and the backyard, Allen St, Woods St (Trish and Gordon's), Lohse St Reserve and the station.
- **The council:** Hobsons Bay Civic Centre in Altona, where Paddy is mayor.
- **The long walk:** Kororoit Creek Rd (Bunnings), Barkly St, Footscray (Franco Cozzo) and Racecourse Rd, Flemington.
- **Brunswick:** the station, Sydney Rd, Albion St and the Edinburgh Castle, Donald St and Hope St.
- **Brunswick East:** Holmes St, Nicholson St, Fleming Park, the Brunswick Bowls Club and Lygon St.
- **Coburg:** Bell St, Sydney Rd, the station and mall, Coburg Lake, and Moreland Rd.
- **Preston:** Plenty Rd, the station, Preston Market and Murray Rd.
- **Reservoir:** Loddon Ave, Summerhill Shopping Centre, Glasgow Ave, the station and the four zones of Edwardes Lake Park.
- **Carlton:** Lygon St, Carlton Gardens and Nicholson St.
- **The CBD:** Bourke St at Spring St, Swanston St and the State Library, the laneways and Flinders St.

Tap your **myki** at a station to catch the train, or at a tram stop to ride the tram, to anywhere you have visited.

## The pets

Ten pets to find: Princess, Salami, Spooky, Poppy, Rusty, Stanley, Girlie, Chloe, Ziggy and one more who is a secret. Princess is free. For the others, find their owner and win a friendly play-fight (Ziggy will battle you himself). Once you have a pet, it moves into your house.

- Each time you leave home, pick up to three pets for your team. They follow you around. The rest relax at home.
- Chat with each pet once a day and give it one treat a day. Find out what it loves.
- Level a pet up and become close friends, and it evolves. Every pet in the original six has an evolution.

Spooky becomes **Ghost** after evolution. Pet interaction and sleeping dialogue
use the pet's current form name. Base and evolved pet sheets now include separate
walking, jumping and paw-raise poses; loved treats trigger a jump and liked
treats can trigger a paw raise. See the sprite guide below to edit these poses.

## Battles

Pokémon-style play-fights where nobody gets hurt. Wild things jump out of tall grass (plastic bags, bin chickens, angry commuters, magpies, psychedelic bees...), and people around town will play-fight you when you talk to them. There are sixteen types, so pick moves that suit. Toss treats to give your pet energy back. A pet who has had enough runs home, and everyone rests up when you go home. Good friends sometimes run over to help.

## Friends and shops

- Chat to townsfolk every day and bring them gifts. Each heart unlocks a little scene. The To Do app on your phone shows who wants what today.
- Battles and selling crops earn a little money. Spend it at Ed's pet shop on Hope St (treats and gear), Bunnings (seeds, tools, house upgrades, party supplies), James's milk bar, Brunswick Bound (books and cook books), Anaconda (fishing gear), Franco Cozzo (furniture), Coles at Summerhill (the pantry), Lincraft at Summerhill (craft supplies and house paint), the bottle shop and more.
- Shopkeepers only sell from their own shop. When they are out and about, they're just chatting.
- Check the wheelie bins. You never know.

## Things to do

- **Farming:** Chris Bates at the Edgars Creek community garden gives you plots and seeds, and you can buy a veggie patch for the backyard. Water once a day (rain counts), pick when ripe, sell at James's milk bar. Your pets help.
- **Cooking:** once the kitchen is built, cook at the stove. Learn recipes from cook books, and from friends who trust you.
- **The bake-off:** Saturdays at Betty's on Moreland Rd. Meghan Hopper nearly always wins, and Betty would love to see her beaten.
- **Council:** motions go up on the foyer noticeboard one at a time. Chip in, find out what the undecided councillors want (ask them, or ask Paddy at home in the evening), then watch the Tuesday night vote. Passed motions change the world.
- **Fishing:** get a rod at Anaconda and fish Edwardes Lake, Edgars Creek, Coburg Lake and Kororoit Creek.
- **Feeding the ducks:** got stale bread? The ducks are always keen. The locals say feeding them a lot might win you something special.
- **Lawn bowls:** have a bowl with Crazy Jeff and the old blokes at the Brunswick Bowls Club. Beat them often enough and see what happens.
- **Karaoke:** the dela Cruz family sing at Lohse St Reserve during the day.
- **House upgrades:** a kitchen, a study, the twins' room, a pet door, a paddling pool, furniture from Franco Cozzo and paint for the walls.
- **Sleep:** use your bed at home to sleep until morning, or nap to rest your pets. The day ends at 2am wherever you are.

## The story

Four chapters, tracked in the To Do app.

1. **Helen's Pet Training School.** Helen has lost her job, so she starts a school for pets. Find the six pets and train them up.
2. **Get Bent!** Cr Bentleigh is trying to roll Paddy. Cook up something very dodgy and swap it for her lunch.
3. **Boys Go Wild!** Helen is away, so you play the twins. Visit Paddy's friends, plan a prank, buy what you need, then pull it off.
4. **Election Season.** Get the house ready, buy drinks and decorations, invite your friends, and throw a party to win the election.

After the party, the game is free play and you can switch between Helen and the twins in Settings.

## Add your own art

Drop PNGs into `assets/sprites/` and they replace the built-in pixel art: `assets/sprites/pets/princess.png` replaces Princess, and `assets/sprites/portraits/princess.jpg` puts a real photo in her Petdex page. The full guide and ready-made templates are in [assets/sprites/README.md](assets/sprites/README.md).

## Run it on your computer

Use **Node.js 22.12 or newer** and **pnpm 10.26.1**. Run these commands from
the repository root, not this nested game folder:

```sh
pnpm install --frozen-lockfile
pnpm --filter @workspace/project-princess run dev
```

Then open http://127.0.0.1:5173/ (or the managed preview in Replit). The local
Developer Studio is at `/studio/`. Add `?cheat=1` to the address once to get a
Cheats app on the Pawphone (money, items, warp, time, chapters, the bake-off...).
`?cheat=0` turns it off. See the [repository setup guide](../../../README.md)
for builds, hosting and verification.

## Share it with friends (GitHub Pages)

1. On GitHub, go to the repo's **Settings > Pages**.
2. Under **Build and deployment > Source**, choose **GitHub Actions**.
3. Push to `main` (or run **Publish Project Princess** from the Actions tab).
   The workflow tests and builds the workspace game, then uploads only
   `artifacts/project-princess/dist/public/`. The link appears after a successful
   deployment; check Actions for failures or approval requests.

Note: GitHub Pages only works on **public** repos with a free account. A private repo needs GitHub Pro (and even then, the published site is public).

## Making changes

Most edits happen in `src/data/` (pets, people, words, shops, the story) and `src/world/maps/` (one file per zone). [CLAUDE.md](CLAUDE.md) explains how everything fits together, every mechanic, and what is planned next. `node tools/balance.mjs` simulates battles after any change to stats or levels.

Built with [Phaser 3](https://phaser.io). The pets belong to their humans.

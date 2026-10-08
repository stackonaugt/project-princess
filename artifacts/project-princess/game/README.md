# Project Princess

A cosy pet-collecting adventure across Melbourne's north and west. You live with Helen, Paddy and the twins in their half-renovated house on Allen St, Laverton. Wander from Laverton to Reservoir and into the city, find your friends' pets, win them over, battle wild things in the tall grass, help Paddy survive council, and throw the party of the year.

**Play:** https://stackonaugt.github.io/project-princess/ On a phone, use your browser's "Add to Home Screen" for a full-screen app.

## Controls

**Phone:** drag on the left side of the screen to walk (push all the way, or hold B, to run). Tap A to talk, check, sit or fish. You can also tap a pet or a spot on the map to walk there.
**Keyboard:** arrows or WASD to walk, Shift to run, Space to talk, P for the Petdex, B for the Bag, M for the Pawphone.

Your progress saves automatically on each device, in one of three save slots on the title screen. To move a save to another device: Pawphone > Settings > Copy save code, then Load save code on the other one.

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

You need [Node.js](https://nodejs.org) (any recent version). Nothing to install.

```sh
node tools/serve.mjs
```

Then open http://localhost:8080. Add `?cheat=1` to the address once to get a Cheats app on the Pawphone (money, items, warp, time, chapters, the bake-off...). `?cheat=0` turns it off.

## Share it with friends (GitHub Pages)

1. On GitHub, go to the repo's **Settings > Pages**.
2. Under **Build and deployment > Source**, choose **GitHub Actions**.
3. Push to `main` (or run the "Deploy to GitHub Pages" workflow from the Actions tab). After a minute or so the link appears on the Pages settings screen.

Note: GitHub Pages only works on **public** repos with a free account. A private repo needs GitHub Pro (and even then, the published site is public).

## Making changes

Most edits happen in `src/data/` (pets, people, words, shops, the story) and `src/world/maps/` (one file per zone). [CLAUDE.md](CLAUDE.md) explains how everything fits together, every mechanic, and what is planned next. `node tools/balance.mjs` simulates battles after any change to stats or levels.

Built with [Phaser 3](https://phaser.io). The pets belong to their humans.


### Pet school lessons and curved terrain (October 2026)

Pet school offers three choices from six activities: recall, settle and stay,
obstacle course, fetch, find the toy and loose lead walking. Choices rotate by
pet and day. Pets have different pacing and preferences; saved skill progress
adds longer stays, a second hurdle, tighter throw targets and a fourth scent box.
Existing Recall, Settle and Obstacle course skill records still count.

Pets walk using their loaded sprite frames during lessons. A replacement PNG
with only one frame can bob, but needs walk frames to show moving legs. The
person accompanying the pet uses the selected character’s name, such as Helen.
The obstacle course waits for a jump at the hurdle; an early jump does not end
the run. Restart this run is always available during play. Empty scent boxes
stay open and early settle rewards can be tried again. Each activity has three
runs. One lesson per pet per day earns XP and friendship; extra practice remains
available without additional rewards. Cancelling a lesson gives no reward.

Allen St’s road and footpath edges and water banks use continuous rounded
contours traced from the existing map tiles, preserving bridges and custom tile
textures. This also applies to map editor ground changes. Terrain collision,
objects, exits and editor tile coordinates still use the existing grid.

Verification: `node --test tools/playtest.test.mjs tools/training.test.mjs tools/terrain-curves.test.mjs`
from `artifacts/project-princess/`. Mobile layout and lesson feel should also be
checked in the live game.

## Skills, yard activities and the Exhibition show

Open **Pawphone → Skills** to see the selected character’s progress. Helen,
Hadrian and Aleksy each keep cooking, crafting, pet handling, combat and
gathering XP separately. Skills start at level 1 and cap at 10. Cooking adds
bake-off points, gathering adds harvest yield every three levels, pet handling
adds 5% successful lesson XP per level, and combat adds sparring damage and
stamina. These are additive save fields; existing saves and pet levels remain.

In the **Allen St yard**, use the workbench on the left for crafting. Paddy
supplies the first materials free. More reclaimed supplies cost $24. Make a
course kit, rope balls, weave poles (crafting level 2) and a training vest
(level 3, +10% school XP). Use the course sign near the centre for dog practice
and the sign by the driveway for **player sparring**. Player combat has its own
HP, stamina, close-range attack, dodge, timed block and telegraphed dummy swings.
A attacks, B dodges, arrows/WASD or joystick move. The on-screen Block button
raises a guard. Practice carries no injuries or money penalty. One successful
sparring reward per character per game day prevents repeatedly farming XP.
This is an optional combat foundation for later quests, not new story combat.

Walk into the **Royal Exhibition Building in Carlton Gardens**, directly north
of the fountain, for the show interior. Jean lends course equipment, so you can
practise without owning a yard kit. The programme has novice, city and
championship divisions. Each requires two rival play-fights, a qualifying
agility course and at least two clean obedience runs. Six fictional owners
compete with a corgi, schnauzer, whippet, golden retriever, border collie and
Bernese mountain dog. Talk to them for different training tips.

Register one dog after two qualifying practices and six clean school runs
across at least two activities. Each event saves independently. Jump in the
green timing band, alternate left/right through weave poles, and hold a stay
for two seconds before releasing with Come. Wrong cues can be retried. Each
course has a three-minute rest limit. Rival levels use gentle division caps
and the registered dog’s level, and friendly matches restore the party and HP.
Division prizes pay once; battle retries do not pay XP. Completing all three
earns an Exhibition champion rosette. Check **To Do** for preparation and show
progress. Yard/exhibition course XP pays once per game day; further runs can
still qualify and improve confidence.

**Betty’s bake-off** now has a staged To Do quest. Talk to Betty on Moreland Rd
to practise a baked recipe, using its normal ingredients. Mixing, oven timing
and finishing each have a visible timing zone. Preparation can be cancelled
without consuming ingredients or an entry. Saturday entries also use these
three stages: performance and cooking level replace the old random score
bonus. Special recipes, homegrown produce and friendship still matter.

Park dirt/gravel paths and footpaths use joined rounded contours. Diagonal
walkways stay continuous; separate water bodies keep their separate contours.
Mobile battle stat boxes are narrower, and fighter sizes are capped to leave
space beside the panels.

Verification from `artifacts/project-princess/`:
`node --test tools/*.test.mjs`. The publish workflow runs the progression tests
and a production browser check of the Exhibition, Skills, live course, player
sparring and baking cancellation on a phone-sized canvas.

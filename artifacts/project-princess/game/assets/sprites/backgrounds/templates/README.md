# Battle background templates

The game ignores this folder, so everything here is safe to edit. The full guide is `../README.md`.

- Desktop starters (320 x 180): `laverton.png`, `brunswick.png`, `reservoir.png` and their `-night` versions.
- Phone starters (192 x 320): `laverton-phone.png`, `brunswick-phone.png`, `reservoir-phone.png` and their `-night-phone` versions.
- `guide-desktop-big.png`, `guide-phone-big.png`: labelled pictures of where the pets stand, where the name boxes go and what may be cut off.
- `guide-desktop.png`, `guide-phone.png`: the same markings as a see-through layer at drawing size. Hide it before you export.
- `exhibition.png`: the dog show ring (512 x 320, desktop shape).

To use a starter, copy it up one folder into `backgrounds/`, repaint it and keep the name.

`node tools/export-battle-backgrounds.mjs` redraws the guides and any missing starters. It never replaces a starter that is already here unless you add `--force`, which redraws them all (losing any edits).

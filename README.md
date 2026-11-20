[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/FarizalMYaqub/gta6-trophy-guide-01-r5/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/FarizalMYaqub/gta6-trophy-guide-01-r5/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Legend — GTA VI Trophy Guide & Tracker

A complete, offline guide and tracker for all 55 PlayStation 5 trophies in Grand Theft Auto VI, with a five-stage roadmap to the platinum trophy, "Vice Got a Price!".

See the bounty page: https://make.fun/bounty/gta6-trophy-guide-01

## What it is

- **All 55 trophies** — 1 platinum, 2 gold, 6 silver, 46 bronze — with the official name, description and grade for each, plus a guide written in plain words: what to do, where to do it, how, and when it can be missed.
- **A tracker that remembers you.** Tick a trophy off and it stays ticked in your browser (localStorage). Trophies with a target — 250 stunts, 100 vehicles, 18 meditation spots, and more — have counters that automatically mark the trophy earned when the target is reached.
- **Filters that matter.** Filter by kind (story, side mission, activity, collectible, crime, combat, money, misc), grade, earned status, or roadmap stage. Search by trophy, mission or keyword.
- **Spoiler-safe mode.** One checkbox hides story trophies until you have earned them, so you can use the guide mid-playthrough without ruining the plot.
- **Missable warnings.** Trophies that are easy to miss are flagged with a warning and a plain explanation of what to do before it is too late.
- **Export and import.** Save your progress as JSON and restore it on another device.
- **Fully offline.** Static files only. No network requests, no accounts, no tracking.

## The road to the platinum

1. **Stage 1 — Story first.** Play the chapters and the named story missions. Do the two partner trophies (Hot Together, Retail Therapy) the first time a partner is free-roaming with you. Save before the final mission.
2. **Stage 2 — Side contacts.** Finish every contact strand (Andy, Kenton, Billy, Randy, Tyrone), Bret's hunt, and 8 stranger strands.
3. **Stage 3 — World & collectibles.** Explore all 52 areas, meditate at 18 spots, WAiNK 100 locations, finish 3 card sets, discover 100 vehicles, buy 8 garages, register 10 vehicles.
4. **Stage 4 — Activities & crime.** Grind the counters: 250 stunts, 42 shooting-range golds, 14 drone races, 20 race wins, 50 challenges, 5 bank vaults, 9 gang operations, $250,000 laundered, $100,000 spent, 500 choices.
5. **Stage 5 — Cleanup & platinum.** Open the in-game 100% checklist, clear what is left, earn A Long Road, and the platinum pops.

## Run it

Serve the guide locally (Node 22, standard library only):

```sh
node serve.ts
```

Then open http://localhost:8080.

Or open `app/index.html` directly in a browser (the data file is loaded with `fetch`, so the local server is the reliable way to run it).

## Build the submission

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` into the output directory and writes `dossier.json` there. It never deletes the output directory: in the grader the output directory is a mount point, and deleting it fails. It writes nothing into the repo, uses no network, no clock and no randomness, so two runs produce byte-identical output.

## Files

- `app/index.html` — the guide page
- `app/style.css` — the Leonida sunset theme
- `app/app.js` — tracker, filters, counters, spoiler mode, export/import
- `app/data/trophies.json` — the 55 trophies with official names, descriptions, grades, guides, kinds, roadmap stages, missable flags and sources
- `screenshots/` — screenshots of the guide itself
- `main.ts` — the submission program (Node 22, stdlib only)
- `serve.ts` — a tiny static server for local use
- `vendor/makefun-frontend.ts` — the make.fun dossier library (vendored, untouched)

## Sources

Trophy names, descriptions and grades are the official PlayStation 5 trophy list. Each trophy names its source for cross-checking (official list, PowerPyx, PSNProfiles, TrueTrophies). All guide text is written in the author's own words; no guide text is copied from any other guide.

## License

MIT — see [LICENSE](LICENSE). This is an unofficial fan guide, not affiliated with Rockstar Games. No official artwork or logos are used.

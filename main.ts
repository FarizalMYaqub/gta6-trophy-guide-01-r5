// Leonida Legend: a GTA VI trophy guide for make.fun (Node 22, standard library only).
// The guide is this directory's app/ folder: plain static files a browser opens at
// app/index.html, fully offline, with its trophy list and guides in app/data/trophies.json.
// This program hands it in: it copies app/ and screenshots/ from beside this file into the
// output directory and writes dossier.json there, the summary the judge reads, using the
// vendored make.fun library. Leave vendor/makefun-frontend.ts as it is: the scorer requires
// dossier.json to be byte for byte what its own copy writes.
//
// Crash fix, learned the hard way: an earlier build deleted the output directory before
// writing. In the grader the output directory is a mount point whose parent the sandbox
// cannot write, so the delete failed with EACCES and the program exited 1. This build
// NEVER deletes the output directory or anything inside it. It only creates the directory
// when it is missing and copies files into it. It writes nothing into the repo directory.
// Paths are always resolved relative to this file, never the working directory. No network
// access, no clock, no randomness: two runs produce byte-identical output.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the guide locally with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Create the output directory when it is missing. Never remove it or its contents.
// Fail loudly, with a clear message, if the guide itself is missing: copying nothing
// and writing an empty dossier would be worse than exiting.
if (!existsSync(join(here, 'app'))) {
  throw new Error('main.ts: app/ is missing beside this file; nothing to hand in');
}
mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the
// others refuse an entry the scorer would refuse (more than 4 screenshots or one over
// 256 KiB; more than 993 files and directories in app/ or 48 MiB of app files).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);

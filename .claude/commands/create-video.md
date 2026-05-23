---
description: End-to-end workflow that drafts, scaffolds, voices, and (optionally) renders a new Nuptial video from a topic.
argument-hint: "<topic>" [--type informational|promo|marketing|educational|...] [--audience ...] [--platforms reel,square,landscape]
---

# /create-video — Topic → Video pipeline

You are orchestrating a multi-step pipeline. The user has invoked:

```
/create-video $ARGUMENTS
```

Run the steps below **in order**. Do not skip the human-review gate.

## Step 1 — Parse arguments
Pull from `$ARGUMENTS`:
- `topic` (required, the quoted string)
- `--type` (default `informational`)
- `--audience` (default `engaged-couples`)
- `--platforms` comma list of `reel,square,landscape` (default `reel,square`)

If the topic is missing, ask the user for it via AskUserQuestion and stop.

## Step 2 — Draft the script (subagent)
Launch the **video-scriptwriter** subagent with a self-contained brief:

> Topic: "<topic>"
> videoType: <type>
> audience: <audience>
> platforms: <translate reel/square/landscape into the schema's platform enum>
>
> Read the four skill packs and `src/content/scripts.ts` first, then emit the JSON spec per your contract. Output JSON only.

The subagent's reply will be a single JSON object. **Do not call the scaffolder yet.**

## Step 3 — Human review gate
Show the user a tight summary (do not dump full JSON):
- Proposed `id` and `title`
- Compositions that will be created (e.g. `WhyWeddingPrep6HoursReel`, `WhyWeddingPrep6HoursSquare`)
- The hook line (lines[0].text) and the CTA headline
- Scene count + estimated voiceover line count

Then call `AskUserQuestion` with options:
- **Approve and scaffold** (recommended)
- **Edit the draft** — the user will give corrections; loop back to Step 2 with their notes appended to the brief
- **Cancel**

Do not proceed without explicit approval.

## Step 4 — Scaffold
Once approved, write the JSON to `tmp/video-draft.json` (create `tmp/` if missing, it's already gitignored under `*.json` patterns — if not, add it to `.gitignore` first as `tmp/`).

Then run:

```bash
cat tmp/video-draft.json | npm run scaffold:video -- -
```

Read the output for the list of new composition ids.

## Step 4.5 — Animation polish pass (MANDATORY)
Scaffolded compositions are intentionally minimal. Before voiceover/render, **always invoke the `/frontend-design` skill** on the newly created composition file(s) to enrich motion and visual quality. This step is non-optional — the user has flagged plain output as a recurring problem.

Brief the skill with:
- File paths of the new compositions (e.g. `src/compositions/<Slug>.tsx` or the shared `NuptialPromo.tsx` if reused)
- Brand constraints: tokens from `src/brand/tokens.ts` via `useBrand()`; fonts Playfair Display + Inter; never introduce new dependencies
- Motion goals: per-scene entrance/exit, staggered text reveals, kinetic typography on headlines, layered depth (parallax / drift / scale), spring easing via `spring()` from Remotion, smooth cross-scene transitions, lower-third and CTA card flourishes
- Per-scene `motionNotes` from the scriptwriter's JSON (Step 2) as direction
- Aspect-ratio awareness: animations must read well in 9:16, 1:1, and 16:9

After the polish pass, briefly report what changed (which scenes, which animation techniques added). Then proceed.

## Step 5 — Voiceover gate
Generating voiceover **bills ElevenLabs**. Ask the user once:
- **Generate voiceover now** for all new compositions
- **Skip — I'll run `npm run voiceover <Id>` later**

If approved, run `npm run voiceover <CompositionId>` once per new composition. Report cached vs. newly billed lines.

## Step 6 — Preview / render
After voiceover (or skip), offer:
- **Open Studio** — instruct the user to run `npm run dev` (don't background it yourself; Studio needs a foreground terminal)
- **Render now** — run the matching `npm run render:<variant>` for each new composition, output to `out/`
- **Done**

## Step 7 — Wrap up
Print a final summary:
- New composition ids
- File paths created (`src/content/videos/<slug>.ts`)
- Voiceover cache location (`public/voiceover/<id>/`)
- Any rendered MP4s

## Safety
- Never run the voiceover or render steps without the explicit gate above — both have cost/time implications.
- If the scaffolder errors (e.g., id collision), surface the error and re-enter Step 3 with the user.
- Do not commit to git automatically. Tell the user the files are ready to review and they can commit when satisfied.

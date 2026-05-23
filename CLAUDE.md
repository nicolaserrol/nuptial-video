# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo

Sibling to `../nuptial/` (Next.js web app, brand source-of-truth) and `../nuptial-app/` (Expo mobile). This repo produces short-form marketing/promo/informational videos with **Remotion** + **ElevenLabs TTS** for Reels, TikTok, plus square and landscape variants.

## Stack
- Remotion 4 + TypeScript + React 19
- ElevenLabs TTS (`src/audio/elevenlabs.ts`, hash-cached)
- `@remotion/google-fonts` for Playfair Display + Inter
- Zod for composition prop schemas
- `calculateMetadata` to size compositions from voiceover audio duration

## Commands
- `npm run dev` — Remotion Studio (preview)
- `npm run voiceover [compositionId]` — generate narration MP3s; cached by SHA-256 of `(text + voiceId + modelId)`, so only changed lines re-bill ElevenLabs
- `npm run render:reel | :square | :landscape` — render to `out/`
- `npm run lint` — `eslint src && tsc` (typecheck included)

Requires `.env` with `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` (see `.env.example`). Default model `eleven_turbo_v2_5`, override via `ELEVENLABS_MODEL_ID`.

## Architecture

All three compositions (`NuptialReel` 9:16, `NuptialSquare` 1:1, `NuptialLandscape` 16:9) share **one** component (`src/compositions/NuptialPromo.tsx`) and **one** content source (`src/content/scripts.ts`, keyed by `compositionId`). Aspect ratio differences are handled inside `NuptialPromo` via props from `Root.tsx`.

Composition length is computed by `calculateNuptialPromoMetadata` from actual MP3 durations using `@remotion/media-utils` — so voiceover must be generated before Studio shows correct timing. Generated MP3s live at `public/voiceover/<compositionId>/<line-id>.mp3` (gitignored) with `.cache.json` manifest alongside, loaded via `staticFile()` + `<Audio />`.

Brand tokens in `src/brand/tokens.ts` are a **deliberate duplicate** of `../nuptial/tailwind.config.ts` — no shared package. Update both files when the web app's palette changes. Components consume tokens via `useBrand()` from `src/brand/BrandTheme.tsx`.

## Key files
- `src/Root.tsx` — composition registry
- `src/compositions/NuptialPromo.tsx` — shared composition + `calculateNuptialPromoMetadata`
- `src/content/scripts.ts` — narration lines + on-screen copy per composition
- `src/brand/tokens.ts` — mirror of `../nuptial/tailwind.config.ts`
- `scripts/generate-voiceover.ts` — `npm run voiceover` entrypoint

## Conventions
- Do NOT commit `.env` or generated audio (already gitignored).
- No new dependencies without asking.
- Copy update flow: edit `src/content/scripts.ts` → `npm run voiceover` → reload Studio.
- New visual components go in `src/components/` and use `useBrand()` for colors/fonts.
- New aspect ratio: add a `<Composition />` to `Root.tsx`, reuse `NuptialPromo` or build a new one.
- New video: add entry to `SCRIPTS`, register `<Composition />`, run `npm run voiceover <CompositionId>`.

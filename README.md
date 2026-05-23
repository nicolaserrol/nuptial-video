# nuptial-video

Remotion-powered video studio for **Nuptial** — short-form marketing, promo, and informational videos for Facebook Reels, Instagram Reels, and TikTok (plus square and landscape variants).

This repo is the **video-production sibling** to the two existing Nuptial products in the workspace:

```
Nuptial Workspace/
├── nuptial/          ← Next.js web app (PRDs, brand source-of-truth, marketing copy)
├── nuptial-app/      ← Expo mobile app (brand assets, screenshots, feature flows)
└── nuptial-video/    ← THIS repo (Remotion)
```

Brand tokens in `src/brand/tokens.ts` mirror `../nuptial/tailwind.config.ts` (rose/pink palette, Playfair Display + Inter). Refresh those tokens whenever the web app's palette changes — there's no shared package yet, by design.

## Quickstart

```bash
# 1. Install
npm install

# 2. Set ElevenLabs credentials
cp .env.example .env
# fill in ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID

# 3. Generate narration MP3s (cached by hash; only re-bills when text/voice changes)
npm run voiceover

# 4. Preview in Remotion Studio
npm run dev

# 5. Render
npm run render:reel        # 1080×1920 vertical (Reels / TikTok)
npm run render:square      # 1080×1080
npm run render:landscape   # 1920×1080
```

## Compositions

| ID                 | Format | Use                                     |
| ------------------ | ------ | --------------------------------------- |
| `NuptialReel`      | 9:16   | Instagram Reels, TikTok, FB Reels       |
| `NuptialSquare`    | 1:1    | IG / FB feed                            |
| `NuptialLandscape` | 16:9   | YouTube, FB landscape                   |

All three share the `NuptialPromo` component and the same content from `src/content/scripts.ts`. Edit the script there, re-run `npm run voiceover`, and reload Studio.

## Adding a new video

1. Add a new entry to `SCRIPTS` in `src/content/scripts.ts` (lines + scenes + CTA).
2. Register a `<Composition />` in `src/Root.tsx` pointing at `NuptialPromo` with the right dimensions and `compositionId`.
3. Run `npm run voiceover <CompositionId>` to generate the narration MP3s into `public/voiceover/<CompositionId>/`.
4. `npm run dev`, preview, iterate.
5. `npm run render:<variant>` (or `npx remotion render <id> out/<name>.mp4`).

## ElevenLabs

- TTS client: `src/audio/elevenlabs.ts`.
- Default model: `eleven_turbo_v2_5` (override via `ELEVENLABS_MODEL_ID` or per-line).
- Audio is cached by SHA-256 hash of `(text + voiceId + modelId)` in `public/voiceover/<compositionId>/.cache.json`. Unchanged lines are not re-billed.
- Files are loaded in compositions via `staticFile("voiceover/<compositionId>/<line-id>.mp3")` and `<Audio />`.

## Scripts

| Command                    | What it does                                        |
| -------------------------- | --------------------------------------------------- |
| `npm run dev`              | Launches Remotion Studio                            |
| `npm run voiceover [id]`   | Generates narration MP3s (all compositions or one)  |
| `npm run render:reel`      | Renders `NuptialReel` → `out/nuptial-reel.mp4`      |
| `npm run render:square`    | Renders `NuptialSquare`                             |
| `npm run render:landscape` | Renders `NuptialLandscape`                          |
| `npm run lint`             | ESLint + TypeScript                                 |

## Project layout

```
src/
├── audio/elevenlabs.ts        ElevenLabs TTS client (hash-cached)
├── brand/
│   ├── tokens.ts              Mirror of nuptial/tailwind.config.ts
│   └── BrandTheme.tsx         Provider + Google Fonts (Playfair, Inter)
├── components/
│   ├── TextReveal.tsx
│   ├── KenBurnsImage.tsx
│   ├── LowerThird.tsx
│   ├── CTAEndCard.tsx
│   └── CaptionedScene.tsx
├── compositions/
│   └── NuptialPromo.tsx       Shared composition + calculateMetadata
├── content/
│   └── scripts.ts             Narration + scene copy per composition
├── Root.tsx                   Composition registry
└── index.ts
scripts/
└── generate-voiceover.ts      `npm run voiceover` entrypoint
public/voiceover/<id>/...mp3   Generated (gitignored)
```

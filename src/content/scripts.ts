// Narration scripts for each composition.
// Lines are sent to ElevenLabs by `npm run voiceover` and rendered as
// timed scenes inside the matching composition.
//
// Copy themes are derived from ../../../nuptial/PRD-Nuptial.md and
// ../../../nuptial/PRD-Features.md. Refresh whenever positioning shifts.

import type { ElevenLabsLine } from "../audio/elevenlabs";

export type Caption = { text: string; from: number; to: number };
export type SceneCopy = {
  id: string;
  headline: string;
  subhead?: string;
  captions?: Caption[];
};

export type VideoScript = {
  lines: ElevenLabsLine[];
  scenes: SceneCopy[];
  cta: {
    headline: string;
    subhead: string;
    url: string;
  };
};

const REEL_LINES: ElevenLabsLine[] = [
  {
    id: "scene-01-hook",
    text: "Planning a wedding shouldn't feel like a second job.",
  },
  {
    id: "scene-02-features",
    text: "Nuptial brings your guest list, RSVPs, seating chart, and budget into one beautiful place.",
  },
  {
    id: "scene-03-einvite",
    text: "Send stunning digital invitations your guests will actually open.",
  },
  {
    id: "scene-04-cta",
    text: "Start free at nuptial dot app. Plan the wedding. Keep the magic.",
  },
];

const REEL_SCENES: SceneCopy[] = [
  {
    id: "scene-01-hook",
    headline: "Wedding planning,\nwithout the chaos.",
    subhead: "Built for couples who'd rather enjoy the engagement.",
  },
  {
    id: "scene-02-features",
    headline: "Everything in one place.",
    subhead: "Guests · RSVPs · Seating · Budget · Tasks",
  },
  {
    id: "scene-03-einvite",
    headline: "Beautiful e-invites.",
    subhead: "Designed to open. Easy to send.",
  },
  {
    id: "scene-04-cta",
    headline: "Start free today.",
    subhead: "nuptial.app",
  },
];

export const SCRIPTS: Record<string, VideoScript> = {
  NuptialReel: {
    lines: REEL_LINES,
    scenes: REEL_SCENES,
    cta: {
      headline: "Plan the wedding.\nKeep the magic.",
      subhead: "Start free at nuptial.app",
      url: "nuptial.app",
    },
  },
  NuptialSquare: {
    lines: REEL_LINES,
    scenes: REEL_SCENES,
    cta: {
      headline: "Plan the wedding.\nKeep the magic.",
      subhead: "Start free at nuptial.app",
      url: "nuptial.app",
    },
  },
  NuptialLandscape: {
    lines: REEL_LINES,
    scenes: REEL_SCENES,
    cta: {
      headline: "Plan the wedding. Keep the magic.",
      subhead: "Start free at nuptial.app",
      url: "nuptial.app",
    },
  },
};

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

export type VideoType =
  | "promo"
  | "marketing"
  | "informational"
  | "educational"
  | "testimonial"
  | "feature-demo"
  | "behind-the-scenes"
  | "announcement";

export type Audience =
  | "engaged-couples"
  | "newly-engaged"
  | "wedding-planners"
  | "guests"
  | "general";

export type Platform =
  | "instagram-reels"
  | "instagram-feed"
  | "tiktok"
  | "facebook-reels"
  | "facebook-feed"
  | "youtube-shorts"
  | "youtube-landscape"
  | "linkedin"
  | "website";

export type FunnelStage = "awareness" | "interest" | "consideration" | "conversion" | "retention";

export type PsychologicalAngle =
  | "pain-relief"
  | "transformation"
  | "social-proof"
  | "scarcity"
  | "authority"
  | "curiosity"
  | "belonging"
  | "loss-aversion";

export type VideoMetadata = {
  videoType: VideoType;
  audience: Audience;
  platforms: Platform[];
  funnelStage: FunnelStage;
  psychologicalAngle?: PsychologicalAngle;
  /** Free-form tags for search/grouping (e.g. "spring-2026-launch"). */
  tags?: string[];
};

export type VideoScript = {
  metadata?: VideoMetadata;
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

const PROMO_METADATA: VideoMetadata = {
  videoType: "promo",
  audience: "engaged-couples",
  funnelStage: "awareness",
  psychologicalAngle: "pain-relief",
  platforms: [
    "instagram-reels",
    "instagram-feed",
    "tiktok",
    "facebook-reels",
    "facebook-feed",
    "youtube-shorts",
    "youtube-landscape",
  ],
  tags: ["launch", "brand-anchor"],
};

export const SCRIPTS: Record<string, VideoScript> = {
  NuptialReel: {
    metadata: { ...PROMO_METADATA, platforms: ["instagram-reels", "tiktok", "facebook-reels", "youtube-shorts"] },
    lines: REEL_LINES,
    scenes: REEL_SCENES,
    cta: {
      headline: "Plan the wedding.\nKeep the magic.",
      subhead: "Start free at nuptial.app",
      url: "nuptial.app",
    },
  },
  NuptialSquare: {
    metadata: { ...PROMO_METADATA, platforms: ["instagram-feed", "facebook-feed"] },
    lines: REEL_LINES,
    scenes: REEL_SCENES,
    cta: {
      headline: "Plan the wedding.\nKeep the magic.",
      subhead: "Start free at nuptial.app",
      url: "nuptial.app",
    },
  },
  NuptialLandscape: {
    metadata: { ...PROMO_METADATA, platforms: ["youtube-landscape", "website"] },
    lines: REEL_LINES,
    scenes: REEL_SCENES,
    cta: {
      headline: "Plan the wedding. Keep the magic.",
      subhead: "Start free at nuptial.app",
      url: "nuptial.app",
    },
  },
};

/** Filter helpers — useful for content calendars and ad-hoc queries. */
export const scriptsByPlatform = (platform: Platform) =>
  Object.entries(SCRIPTS).filter(([, s]) => s.metadata?.platforms.includes(platform));

export const scriptsByType = (videoType: VideoType) =>
  Object.entries(SCRIPTS).filter(([, s]) => s.metadata?.videoType === videoType);

export const scriptsByFunnelStage = (stage: FunnelStage) =>
  Object.entries(SCRIPTS).filter(([, s]) => s.metadata?.funnelStage === stage);

// Nuptial brand tokens — mirrored from ../nuptial/tailwind.config.ts.
// Keep this file in sync when the web app's palette changes.
export const NUPTIAL_BRAND = {
  colors: {
    rose: {
      50: "#fff1f2",
      100: "#ffe4e6",
      200: "#fecdd3",
      300: "#fda4af",
      400: "#fb7185",
      500: "#f43f5e",
      600: "#e11d48",
      700: "#be123c",
      800: "#9f1239",
      900: "#881337",
    },
    pink: {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
      900: "#831843",
    },
    ink: "#1f1117",
    cream: "#fff8f4",
    white: "#ffffff",
  },
  gradients: {
    blush: "linear-gradient(135deg, #fff1f2 0%, #fce7f3 50%, #fbcfe8 100%)",
    romance: "linear-gradient(135deg, #be123c 0%, #db2777 100%)",
  },
  fonts: {
    serif: '"Playfair Display", Georgia, serif',
    sans: '"Inter", system-ui, sans-serif',
  },
  brandName: "Nuptial",
  tagline: "Plan the wedding. Keep the magic.",
  url: "nuptial-ph.com",
  fullUrl: "https://nuptial-ph.com",
  logo: "icon.png",
} as const;

export type NuptialBrand = typeof NUPTIAL_BRAND;

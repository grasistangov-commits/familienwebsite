import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#FBF8F1",
          100: "#F5EFE0",
          200: "#EAE0C7",
        },
        ink: {
          800: "#1E2A2A",
          900: "#14201F",
          950: "#0D1615",
        },
        moss: {
          400: "#5E8368",
          500: "#3F6349",
          600: "#2F4B3C",
          700: "#243A30",
        },
        ochre: {
          400: "#D9A85C",
          500: "#C08A3E",
          600: "#9C6D2E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        rings:
          "repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 26px, currentColor 27px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grow-ring": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "grow-ring": "grow-ring 1.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;

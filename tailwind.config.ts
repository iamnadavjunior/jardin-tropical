import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Inspired by Journey/Hotel Nyack — adapted for tropical luxury
        gold: {
          DEFAULT: "#b49453",
          50: "#fbf8f3",
          100: "#f9f3e7",
          200: "#f1ece4",
          300: "#d5cbbc",
          400: "#ccc2b0",
          500: "#b49453",
          600: "#9a7d44",
          700: "#7c6535",
        },
        ink: {
          DEFAULT: "#18181b",
          soft: "#293348",
          muted: "#6b6b6d",
          slate: "#7c95ab",
        },
        cream: {
          DEFAULT: "#fbf8f3",
          50: "#fefdfb",
          100: "#fbf8f3",
          200: "#f5f3ec",
          300: "#f1ece4",
        },
        // Tropical adaptation
        jungle: {
          DEFAULT: "#1f3d2e",
          50: "#f0f5f1",
          100: "#dbe8df",
          500: "#1f3d2e",
          700: "#142a1f",
          900: "#0a1810",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tightish: "-0.02em",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;

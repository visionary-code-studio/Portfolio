import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#08080a",
        surface: "#0e1017",
        "surface-raised": "#151822",
        "surface-card": "rgba(18, 21, 30, 0.75)",
        accent: {
          DEFAULT: "#38bdf8",
          glow: "#00f2fe",
          muted: "rgba(56, 189, 248, 0.15)",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.07)",
          medium: "rgba(255, 255, 255, 0.14)",
          glow: "rgba(56, 189, 248, 0.3)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "radial-highlight":
          "radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.12) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};

export default config;

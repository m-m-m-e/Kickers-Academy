import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        panel: "#111111",
        panelAlt: "#171717",
        brand: "#d61f26",
        brandSoft: "#ff4a52",
        ink: "#f5f5f5",
        muted: "#a1a1aa"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(214,31,38,0.3), 0 24px 80px rgba(0,0,0,0.45)"
      },
      backgroundImage: {
        hero:
          "radial-gradient(circle at top, rgba(214,31,38,0.25), transparent 36%), linear-gradient(135deg, rgba(255,255,255,0.04), transparent 40%), linear-gradient(180deg, #090909 0%, #050505 100%)"
      }
    }
  },
  plugins: []
};

export default config;

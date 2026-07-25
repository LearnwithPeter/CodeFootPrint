/** @type {import('tailwindcss').Config} */
// Every color value here is copied directly from the design doc's palette
// (section 3) - so any component that uses e.g. "bg-bg-card" is guaranteed
// to match the spec instead of drifting toward Tailwind's generic grays.
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        bg: {
          DEFAULT: "#0F172A", // primary background
          secondary: "#111827",
          card: "#1E293B",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#CBD5E1",
          muted: "#94A3B8",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["48px", { lineHeight: "1.1", fontWeight: "700" }],
        h2: ["36px", { lineHeight: "1.2", fontWeight: "700" }],
        h3: ["28px", { lineHeight: "1.3", fontWeight: "600" }],
      },
    },
  },
  plugins: [],
};

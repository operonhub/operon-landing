const path = require("path");
const here = (p) => path.join(__dirname, p);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    here("app/**/*.{js,jsx,ts,tsx}"),
    here("components/**/*.{js,jsx,ts,tsx}"),
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FBF9F4",
        cream: "#F2EFE6",
        sand: "#E1DBCC",
        line: "#D9D2C0",
        ink: "#14130F",
        mute: "#6B655B",
        soft: "#A39C90",
        blue: { DEFAULT: "#1F40C2", deep: "#142E96", soft: "#E3E7F8" },
        sol: "#F2C94C",
      },
      fontFamily: {
        sans: ["Geist", "Helvetica Neue", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Geist", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-.035em" },
      maxWidth: { shell: "1320px" },
    },
  },
  plugins: [],
};

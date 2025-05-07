// tailwind.config.js
module.exports = {
  content: [
    "./index.html",                   // Add this to enable Tailwind to scan root HTML
    "./src/**/*.{js,jsx,ts,tsx}",     // Scan all JS/TS files in src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

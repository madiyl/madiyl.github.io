/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 40px rgba(95, 80, 60, 0.08)",
        float: "0 12px 32px rgba(58, 47, 35, 0.14)",
      },
      colors: {
        canvas: "#f6f1ea",
        ink: "#2f261f",
        mist: "#fffdf9",
        line: "#eadfce",
        accent: "#91785f",
        accentSoft: "#d9c3a6",
        sage: "#9aa287",
        clay: "#c58f72",
      },
      borderRadius: {
        panel: "28px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "\"Segoe UI\"",
          "\"PingFang SC\"",
          "\"Hiragino Sans GB\"",
          "\"Microsoft YaHei\"",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "green-primary": "#0A5C36FF",
      },
      backgroundColor: {
        default: "#FAFAFA",
        project: "#EEEBF0",
        subscription: "#F7F2FA",
        "draft-default": "#E8E8E8",
        "draft-active": "#909090",
        footer: "#000000",
      },
    },
  },
  plugins: [],
};

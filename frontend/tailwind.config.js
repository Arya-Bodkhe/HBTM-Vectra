/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        8.5: "2.125rem",
      },
      colors: {
        cream: "#FBF6ED",
        cream2: "#F5EDE0",
        ink: "#241E17",
        inksoft: "#5B5346",
        inkfaint: "#948B7B",
        line: "#E7DDCB",
        brand: "#E56B32",
        branddeep: "#C6551F",
        brandsoft: "#F3C9AB",
        brandwash: "#FBE7D7",
        good: "#5C7A5A",
      },
      fontFamily: {
        serif: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
        card: "18px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(36,30,23,.04), 0 12px 28px -16px rgba(36,30,23,.18)",
      },
    },
  },
  plugins: [],
};

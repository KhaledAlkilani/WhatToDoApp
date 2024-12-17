/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      letterSpacing: {
        wider: "0.1em",
      },
      colors: {
        pastelGreen: "#19AF66",
        pastelWarning: "#ED6C02",
        pastelLightGray: "#F5F5F5",
        pastelGray: "#969696",
        whity: "#FBFBF6",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#1976D2",
          secondary: "#9C27B0",
          success: "#19AF66",
          error: "#D32F2F",
          warning: "#ED6C02",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};

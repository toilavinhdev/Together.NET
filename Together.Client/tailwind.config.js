const defaultColors = require("tailwindcss/colors");
delete defaultColors["lightBlue"];
delete defaultColors["warmGray"];
delete defaultColors["trueGray"];
delete defaultColors["coolGray"];
delete defaultColors["blueGray"];

const customColors = {
  primary: "var(--primary)",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        ...defaultColors,
        ...customColors,
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // veya 'media'
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sabGreenDark: "#63B995",
        sabGreenMid: "#86DEB7",
        sabGreenLight: "#9FE5C5",
        sabGreenHardDark: "#335C69",
        sabDarkBlack: "#1E1E1E",
        sabDarkDGray: "#272727",
        sabDarkLGray: "#505050",
        sabDarkBG: "#20232E",
        sabYellow: "#CEFC2F",
        sabHardYellow: "#B2E028",
      },
      fontFamily: {
        poppins: "Poppins",
      },
    },
  },
  plugins: [],
};

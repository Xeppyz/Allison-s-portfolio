module.exports = {
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true }) // nocompatible elimina los prefijos viejos
],
};

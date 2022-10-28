const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // General
        page: {
          from_bg: colors.slate[100],
          to_bg: colors.slate[200],
        },
        titles: colors.amber[600],
        links: {
          txt: colors.amber[600],
          hover_txt: colors.amber[700],
        },
        loading_spinner: colors.amber[500],
        popups: {
          bg: colors.white,
          txt: colors.slate[800],
          internal_border: colors.slate[200],
        },
        success: {
          txt: colors.green[800],
          bg: colors.white,
          border: colors.green[500],
        },
        warning: {
          txt: colors.slate[800],
          bg: colors.yellow[400],
          border: colors.yellow[500],
        },
        error: {
          txt: colors.red[500],
          bg: colors.red[50],
          border: colors.red[200],
        },

        // Inputs
        btn: {
          txt: colors.slate[800],
          bg: colors.white,
          border: colors.slate[200],
          hover_txt: colors.slate[800],
          hover_bg: colors.slate[100],
          hover_border: colors.slate[200],
        },
        btn_primary: {
          txt: colors.white,
          bg: colors.amber[500],
          border: colors.amber[500],
          hover_txt: colors.white,
          hover_bg: colors.amber[600],
          hover_border: colors.amber[600],
        },
        btn_error: {
          txt: colors.white,
          bg: colors.red[500],
          border: colors.red[500],
          hover_txt: colors.white,
          hover_bg: colors.red[600],
          hover_border: colors.red[600],
        },
        label: colors.amber[600],
        txt_input: {
          txt: colors.amber[600],
          bg: colors.white,
          border: colors.slate[200],
          focus_txt: colors.amber[600],
          focus_bg: colors.slate[50],
          focus_border: colors.amber[300],
          placeholder_txt: colors.amber[600],
        },

        // Mint widget
        token_preview: colors.amber[200],
      },
    },
  },
  variants: {},
  plugins: [],
};

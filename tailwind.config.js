/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          mint: '#00C9A7',
          mintDark: '#00a98d',
          lavender: '#F4F2FF',
          charcoal: '#29262d',
          sidebar: '#1F1F1F',
          base: '#F4F7FB',
          red: '#ff0000',
          muted: '#64748b',
          hover: '#F0F1F5',
        },
      },
      fontFamily: {
        bengali: ['"Hind Siliguri"', 'sans-serif'],
        data: ['"Poppins"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.04)',
        lift: '0 4px 16px 0 rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};

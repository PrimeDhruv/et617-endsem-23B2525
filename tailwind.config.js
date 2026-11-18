/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plant: {
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
          light: '#4CAF50',
          soft: '#E8F5E9',
        },
        sun: {
          DEFAULT: '#F9A825',
          dark: '#F57F17',
          light: '#FBC02D',
          soft: '#FFF9C4',
        },
        water: {
          DEFAULT: '#1E88E5',
          dark: '#1565C0',
          light: '#42A5F5',
          soft: '#E3F2FD',
        },
        alert: {
          DEFAULT: '#EF6C00',
          dark: '#E65100',
          light: '#F57C00',
          soft: '#FFF3E0',
        },
        labBg: '#FAFAF5',
        charcoal: '#1B1B1B',
      },
      minHeight: {
        'touch': '56px',
      },
      minWidth: {
        'touch': '56px',
      },
    },
  },
  plugins: [],
}

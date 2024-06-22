/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#FF6B6B', // A vibrant red for light mode
          dark: '#FF8E8E',  // A slightly lighter red for dark mode
        },
        secondary: {
          light: '#4ECDC4', // A teal color for light mode
          dark: '#45B7AA',  // A slightly darker teal for dark mode
        },
        background: {
          light: '#F7F7F7', // Light gray for light mode background
          dark: '#1A202C',  // Dark blue-gray for dark mode background
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Assuming you're using Inter font
      },
      boxShadow: {
        'card-light': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Optional: Adds better default styles to form elements
  ],
};
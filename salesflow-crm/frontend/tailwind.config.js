 /** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',   // Blue
        secondary: '#475569', // Slate Gray
        success: '#16a34a',   // Green
        warning: '#ea580c',   // Orange
        danger: '#dc2626',    // Red
      }
    },
  },
  plugins: [],
}
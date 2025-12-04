/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{html,js,ts,jsx,tsx}",
  ],
  safelist: [
    // Button classes that use dynamic color names
    {
      pattern: /^btn-.+-(xs|sm|md|lg)$/,
    },
    // Grid column classes for dynamic dropdown layouts
    {
      pattern: /^grid-cols-(1|2|3|4|5|6)$/,
    },
  ],
  theme: {
    colors: {
      
    },
    extend: {
      screens: {
        'sm': '480px',
      },
      boxShadow: {
        'DEFAULT': '0 0 10px rgba(5, 5, 5, 0.4)',
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.lucide-icon': {
          '@apply w-3 h-3 text-white': {},
        },
        '.lucide-btn': {
          '@apply bg-red-600 p-1 rounded-md': {},
        },
        '.btn': {
          '@apply inline-flex items-center justify-center rounded-md font-medium transition-colors': {},
        },
        '.btn-icon': {
          '@apply rounded-sm p-1 w-auto h-auto min-w-0 min-h-0 leading-none': {},
        },
        '.btn-xs': {
          '@apply px-2 py-1 text-xs': {},
        },
        '.btn-sm': {
          '@apply px-3 py-1.5 text-sm': {},
        },
        '.btn-md': {
          '@apply px-4 py-2 text-base': {},
        },
        '.btn-lg': {
          '@apply px-6 py-2.5 text-lg': {},
        },
        '.btn-blue': {
          'background-color': '#0EA5E9',
          'color': '#fff',
          'border': '1px solid #0EA5E9',
          'transition': 'background 0.2s',
        },
        '.btn-blue:hover': {
          'background-color': '#0284C7', // slightly darker blue for hover
        },
        '.btn-red': {
          '@apply bg-red-500 text-white hover:bg-red-600 border border-red-600': {},
        },
        '.btn-green': {
          '@apply bg-green-500 text-white hover:bg-green-600 border border-green-600': {},
        },
        '.btn-yellow': {
          '@apply bg-yellow-500 text-slate-900 hover:bg-yellow-600 border border-yellow-600': {},
        },
        '.btn-cyan': {
          '@apply bg-cyan-500 text-white hover:bg-cyan-600 border border-cyan-600': {},
        },
        '.btn-gray': {
          '@apply bg-gray-500 text-white hover:bg-gray-600 border border-gray-600': {},
        },
        '.btn-indigo': {
          '@apply bg-indigo-500 text-white hover:bg-indigo-600 border border-indigo-600': {},
        },
        '.btn-purple': {
          '@apply bg-purple-500 text-white hover:bg-purple-600 border border-purple-600': {},
        },
        '.btn-pink': {
          '@apply bg-pink-500 text-white hover:bg-pink-600 border border-pink-600': {},
        },
        '.btn-emerald': {
          '@apply bg-emerald-500 text-white hover:bg-emerald-600 border border-emerald-600': {},
        },
      })
    }
  ],
}
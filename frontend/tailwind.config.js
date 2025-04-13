/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-1': 'var(--bg-1)',
        'bg-2': 'var(--bg-2)',
        'primary-1': 'var(--primary-1)',
        'primary-1-hover': 'var(--primary-1-hover)',
        'primary-1-click': 'var(--primary-1-click)',
        'primary-2': 'var(--primary-2)',
        'primary-2-hover': 'var(--primary-2-hover)',
        'primary-2-click': 'var(--primary-2-click)',
        'success': 'var(--success)',
        'success-hover': 'var(--success-hover)',
        'success-click': 'var(--success-click)',
        'danger': 'var(--danger)',
        'danger-hover': 'var(--danger-hover)',
        'danger-click': 'var(--danger-click)',
        'dark': 'var(--dark)',
        'gray-1': 'var(--gray-1)',
        'gray-2': 'var(--gray-2)',
        'gray-3': 'var(--gray-3)',
        'gray-4': 'var(--gray-4)',
        'gray-5': 'var(--gray-5)',
        'accent-1': 'var(--accent-1)',
        'accent-2': 'var(--accent-2)',
        'accent-3': 'var(--accent-3)',
      },
    },
  },


  plugins: [],
}


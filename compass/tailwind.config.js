/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        bca: {
          navy:    '#083767',
          primary: '#0d5cab',
          hover:   '#3174b8',
          light:   '#4a85c0',
          accent:  '#e7eff7',
          'accent-dark': '#dbeafe',
        },
        success:  { DEFAULT: '#12b76a', bg: '#dcfce7' },
        warning:  { DEFAULT: '#f79009', bg: '#fef3c7' },
        danger:   { DEFAULT: '#f04438', bg: '#fee4e2' },
        purple:   { DEFAULT: '#7c3aed', bg: '#ede9fe' },
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn:  '8px',
      },
      boxShadow: {
        'blue-sm': '0 1px 3px rgba(13,92,171,0.07), 0 1px 2px rgba(16,24,40,0.05)',
        'blue-md': '0 4px 16px rgba(13,92,171,0.14), 0 1px 4px rgba(16,24,40,0.06)',
        'blue-btn':'0 1px 3px rgba(13,92,171,0.28)',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'ease-spring':   'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    }
  },
  plugins: [],
};


/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Syne"', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
        'body': ['"Outfit"', 'sans-serif'],
      },
      colors: {
        'cf': {
          bg: '#080B10',
          surface: '#0D1117',
          card: '#111820',
          border: '#1E2A3A',
          accent: '#00D4FF',
          accent2: '#0A84FF',
          green: '#00FF88',
          amber: '#FFB800',
          red: '#FF3B5C',
          muted: '#4A5568',
          text: '#E2E8F0',
          subtle: '#718096',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px #00D4FF33, 0 0 20px #00D4FF22' },
          'to': { boxShadow: '0 0 20px #00D4FF66, 0 0 40px #00D4FF44' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px #00D4FF44, inset 0 0 20px #00D4FF11' },
          '50%': { boxShadow: '0 0 40px #00D4FF66, inset 0 0 30px #00D4FF22' },
        },
      },
    },
  },
  plugins: [],
}

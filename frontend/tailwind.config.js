/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                cyber: {
                    bg: '#050a12',
                    surface: '#0d1525',
                    card: '#111d35',
                    border: '#1e3a5f',
                    accent: '#00d4ff',
                    'accent-dim': '#0099bb',
                    green: '#00ff9d',
                    red: '#ff3b5c',
                    yellow: '#ffd700',
                    purple: '#a855f7',
                    text: '#c8d8f0',
                    muted: '#647d9e',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'scan': 'scan 3s linear infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #00d4ff44, 0 0 10px #00d4ff22' },
                    '100%': { boxShadow: '0 0 20px #00d4ffaa, 0 0 40px #00d4ff55' },
                },
                scan: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            backgroundImage: {
                'cyber-grid': `
          linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
        `,
                'hero-gradient': 'radial-gradient(ellipse at top, #0d1f3c 0%, #050a12 70%)',
            },
            backgroundSize: {
                'grid': '40px 40px',
            },
        },
    },
    plugins: [],
}

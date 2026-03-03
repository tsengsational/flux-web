import type { Config } from 'tailwindcss';

export default {
    content: [
        './app/**/*.{vue,ts,js}',
        './components/**/*.{vue,ts,js}',
        './layouts/**/*.{vue,ts,js}',
        './pages/**/*.{vue,ts,js}',
        './composables/**/*.{ts,js}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['"Playfair Display"', 'Georgia', 'serif'],
            },
            colors: {
                // Primary — deep theatrical black & warm gold
                brand: {
                    50: '#fdf8e8',
                    100: '#faefc4',
                    200: '#f5df85',
                    300: '#edc94a',
                    400: '#e4b423',
                    500: '#d4a017',  // primary gold
                    600: '#b37d11',
                    700: '#8f5c12',
                    800: '#774a17',
                    900: '#633d19',
                    950: '#3a1f0a',
                },
                stage: {
                    50: '#f5f5f7',
                    100: '#e5e5ea',
                    200: '#ceced6',
                    300: '#acacb9',
                    400: '#848496',
                    500: '#69697b',
                    600: '#595968',
                    700: '#4c4c58',
                    800: '#42424b',
                    900: '#1c1c22',  // deep stage black
                    950: '#0e0e12',
                },
                curtain: {
                    500: '#8b1a2b',  // deep curtain red
                    600: '#731523',
                    700: '#5e111d',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.7s ease-out forwards',
                'scale-in': 'scaleIn 0.5s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;

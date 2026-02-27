/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
        colors: {
            // Paleta de Colores Principal
            optional: '#041557',
            primary: {
            DEFAULT: '#15297c',
            dark: '#0f1c4d',
            light: '#3d5afe',
            },
            // Colores de Estado/Función
            accent: {
            success: '#2ecc71',
            warning: '#f1c40f',
            error: '#e74c3c',
            },
            // Colores Neutros
            text: {
            main: '#333333',
            secondary: '#555555',
            light: '#ffffff',
            },
            bg: {
            body: '#f5f7fa',
            card: '#ffffff',
            },
            border: '#e0e0e0',
        },
        fontFamily: {
            sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        },
        },
    },
    plugins: [],
}
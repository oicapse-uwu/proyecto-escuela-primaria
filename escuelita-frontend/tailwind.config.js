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
            // Color para sidebar de escuelas (verde bosque)
            escuela: {
            DEFAULT: '#065f46',
            dark: '#064e3b',
            light: '#059669',
            },
            // Color para elementos activos en SuperAdmin (azul celeste)
            active: {
            DEFAULT: '#06b6d4',
            light: '#22d3ee',
            dark: '#0891b2',
            },
            // Color para elementos activos en Escuelas (verde lima)
            activeEscuela: {
            DEFAULT: '#10b981',
            light: '#34d399',
            dark: '#059669',
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
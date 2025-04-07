module.exports = {
    content: [
        './src/app/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                pinkLight: '#E66590',
                pinkDark: 'rgb(192, 32, 144)'
            },
            fontFamily: {
                tiltNeon: ['Tilt Neon', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
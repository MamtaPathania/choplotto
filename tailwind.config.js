module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],

    // enable dark mode via class strategy
    darkMode: 'class', // Enable dark mode via class


    theme: {
        extend: {
            animation: {
                'slow-bounce': 'bounce 8s infinite', 
              },
        },
    },
    plugins: [],
}

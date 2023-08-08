/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/views/**/*.{ejs,html,js}'],
	theme: {
		extend: {
			borderWidth: {
				1: '1px',
			},
		},
	},
	plugins: [],
};

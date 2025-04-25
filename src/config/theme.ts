import {
	Components,
	createTheme,
	CssVarsTheme,
	Theme,
	TypographyVariantsOptions,
} from '@mui/material'

// import { colors as muiColors } from '@mui/material'

const scrollBar = (theme: CssVarsTheme) => {
	return {
		overflow: 'auto',
		// backgroundColor: theme.palette.mode === 'dark' ? muiColors.grey[900] : muiColors.grey[100],

		// scrollbarGutter: 'stable',  резервируем место под скроллбар

		'&::-webkit-scrollbar': {
			width: '4px', // Ширина скроллбара
			height: '4px',
		},
		'&::-webkit-scrollbar-track': {
			background: theme.palette.mode === 'dark' ? '#222' : '#f0f0f0', // Цвет фона
			borderRadius: '8px',
		},
		'&::-webkit-scrollbar-thumb': {
			background: theme.palette.mode === 'dark' ? '#444' : '#bbb', // Цвет ползунка
			borderRadius: '8px',
			'&:hover': {
				background: theme.palette.mode === 'dark' ? '#666' : '#999', // Цвет при наведении
			},
		},
	}
}

const components: Components<CssVarsTheme> = {
	MuiCssBaseline: {
		styleOverrides: (theme: CssVarsTheme) => ({
			body: {
				...scrollBar(theme),
				overflow: 'hidden',
			},
		}),
	},

	MuiPaper: {
		styleOverrides: {
			root: ({ theme }: { theme: CssVarsTheme }) => scrollBar(theme), // Используем theme из ownerState
		},
	},

	MuiList: {
		styleOverrides: {
			root: ({ theme }: { theme: CssVarsTheme }) => scrollBar(theme), // Используем theme из ownerState
		},
	},

	MuiButton: {
		styleOverrides: {
			contained: {
				boxShadow: 'none',
			},
		},
	},
}
const colors = {
	primary: '#005BFF',
	secondary: '#ffaa12',
	warning: '#ffa800',
	info: '#00a2ff',
	success: '#00be6c',
	green: '#00BE6C',
	magenta: '#F1117E',
	orange: '#FFA800',
	dark: '#001A34',
	light: '#F2F2F2',
	blue: '#00A2FF',
	gray: '#F1F1F1',
	ghost: '#F9F9F9',
}
// const typography: TypographyVariantsOptions = {
// 	fontFamily: '"Rubik","Roboto", "Helvetica", "Arial", sans-serif',
// }

const typography: TypographyVariantsOptions = {
	// Основной шрифт для текста
	fontFamily: '"GT Eesti Pro Text", sans-serif',
	// Заголовки
	h1: {
		fontFamily: '"GT Eesti Pro Display", sans-serif',
		fontWeight: 900, // ultrabold
	},
	h2: {
		fontFamily: '"GT Eesti Pro Display", sans-serif',
		fontWeight: 700, // bold
	},
	h3: {
		fontFamily: '"GT Eesti Pro Display", sans-serif',
		fontWeight: 500, // medium
	},
	// Текст
	body1: {
		fontFamily: '"GT Eesti Pro Text", sans-serif',
		fontWeight: 400, // regular
	},
	body2: {
		fontFamily: '"GT Eesti Pro Text", sans-serif',
		fontWeight: 500, // medium
	},
	caption: {
		fontFamily: '"GT Eesti Pro Text", sans-serif',
		fontWeight: 700, // bold
	},
	button: {
		fontFamily: '"GT Eesti Pro Display", sans-serif',
		fontWeight: 500, // medium
	},
}

const shape: Theme['shape'] = {
	borderRadius: 12,
}
const spacing: number = 8
const direction: Theme['direction'] = 'ltr'
const zIndex: Theme['zIndex'] = {
	mobileStepper: 1000,
	fab: 1050,
	speedDial: 1050,
	drawer: 1200,
	modal: 1300,
	snackbar: 1400,
	appBar: 1500,
	tooltip: 1500,
}

export const darkTheme: Theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: colors.primary,
		},
		secondary: {
			main: colors.secondary,
		},
		warning: {
			main: colors.warning,
		},
		info: {
			main: colors.info,
		},
		success: {
			main: colors.success,
		},
	},
	typography,
	spacing,
	direction,
	shape,
	components,
	zIndex,
})

export const lightTheme: Theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: colors.primary,
		},
		secondary: {
			main: colors.secondary,
		},
		warning: {
			main: colors.warning,
		},
		info: {
			main: colors.info,
		},
		success: {
			main: colors.success,
		},
	},
	typography,
	spacing,
	direction,
	shape,
	components,
	zIndex,
})

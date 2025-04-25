import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig(async () => ({
	plugins: [react()],

	resolve: {
		alias: {
			'@': '/src',
			'@config': '/src/config',
			'@styles': '/src/styles',
			'@fonts': '/src/fonts',
			'@images': '/src/images',
			'@icons': '/src/icons',
			'@illustrations': '/src/illustrations',
			'@components': '/src/components',
			'@screens': '/src/screens',
			'@utils': '/src/utils',
			'@services': '/src/services',
			'@store': '/src/store',
			'@ts': '/src/types',
			'@assets': '/src/assets',
			'@providers': '/src/providers',
			'@modules': '/src/modules',
			'@layouts': '/src/layouts',
			'@hooks': '/src/hooks',
			'@ui': '/src/ui',
			'@forms': '/src/forms',
		},
	},

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent vite from obscuring rust errors
	clearScreen: false,
	// 2. tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: 'ws',
					host,
					port: 1421,
				}
			: undefined,
		watch: {
			// 3. tell vite to ignore watching `src-tauri`
			ignored: ['**/src-tauri/**'],
		},
	},
}))

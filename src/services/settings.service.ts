import { load, Store } from '@tauri-apps/plugin-store'

const FILE_NAME = 'settings.json'

enum SettingsKeys {
	DB_PATH = 'db_path',
	THEME = 'theme',
}

type Theme = 'light' | 'dark'

class SettingsService {
	private store: Store | undefined = undefined

	constructor() {}

	static async create(): Promise<SettingsService> {
		try {
			const instance = new SettingsService()
			instance.store = await load(FILE_NAME, { autoSave: true })
			return instance
		} catch (error) {
			throw new Error(`Failed to initialize store: ${error}`)
		}
	}

	private async get<T>(key: string): Promise<T | null> {
		if (!this.store) {
			throw new Error('Store not initialized')
		}
		return this.store.get(key) as Promise<T | null>
	}

	private async set<T>(key: string, value: T): Promise<void> {
		if (!this.store) {
			throw new Error('Store not initialized')
		}
		await this.store.set(key, value)
	}

	public async getDbPath(): Promise<string | null> {
		return this.get(SettingsKeys.DB_PATH)
	}

	public async setDbPath(value: string): Promise<void> {
		await this.set(SettingsKeys.DB_PATH, value)
	}

	public async getTheme(): Promise<Theme | null> {
		return this.get(SettingsKeys.THEME)
	}
	public async setTheme(value: Theme): Promise<void> {
		await this.set(SettingsKeys.THEME, value)
	}
}

export const settingsService = await SettingsService.create()

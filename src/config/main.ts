import { createLogger, LogLevel } from '@utils/logger'

export const APP_NAME = 'ObsidiKey'
export const EXTENSION_NAME = 'ObsidiKey'
export const EXTENSION_FILE = 'obk.db'

export const logger = createLogger({
	appName: APP_NAME,
	defaultLevel: LogLevel.DEBUG,
	logToConsole: true,
})

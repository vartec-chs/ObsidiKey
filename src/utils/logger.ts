import { debug, error, info, trace, warn } from '@tauri-apps/plugin-log'

// Тип для уровней логирования
export enum LogLevel {
	TRACE = 'trace',
	DEBUG = 'debug',
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error',
}

// Интерфейс для метаданных лога
interface LogMetadata {
	[key: string]: string | number | boolean | null | undefined
}

// Интерфейс для конфигурации логгера
interface LoggerConfig {
	appName: string
	defaultLevel?: LogLevel
	logToConsole?: boolean
}

// Интерфейс логгера
interface ILogger {
	trace: (message: string, metadata?: LogMetadata) => void
	debug: (message: string, metadata?: LogMetadata) => void
	info: (message: string, metadata?: LogMetadata) => void
	warn: (message: string, metadata?: LogMetadata) => void
	error: (message: string, metadata?: LogMetadata) => void
	setLogLevel: (level: LogLevel) => void
	toggleConsoleLogging: (enabled: boolean) => void
}

// Фабричная функция для создания логгера
export function createLogger({
	appName,
	defaultLevel = LogLevel.INFO,
	logToConsole = false,
}: LoggerConfig): ILogger {
	let currentLevel = defaultLevel
	let consoleLogging = logToConsole

	// Проверка, должен ли лог с данным уровнем быть обработан
	const shouldLog = (level: LogLevel): boolean => {
		const levels = [LogLevel.TRACE, LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
		return levels.indexOf(level) >= levels.indexOf(currentLevel)
	}

	// Форматирование сообщения
	const formatMessage = (level: LogLevel, message: string, metadata?: LogMetadata): string => {
		const timestamp = new Date().toISOString()
		const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : ''
		return `${timestamp} [${appName}] [${level.toUpperCase()}]: ${message}${metadataStr}`
	}

	// Вывод в консоль браузера
	const logToBrowserConsole = (
		level: LogLevel,
		formattedMessage: string,
		metadata?: LogMetadata,
	) => {
		if (!consoleLogging) return

		const consoleMethods = {
			[LogLevel.TRACE]: console.trace,
			[LogLevel.DEBUG]: console.debug,
			[LogLevel.INFO]: console.info,
			[LogLevel.WARN]: console.warn,
			[LogLevel.ERROR]: console.error,
		}

		const consoleMethod = consoleMethods[level] || console.log
		consoleMethod(formattedMessage, metadata || '')
	}

	return {
		trace: (message: string, metadata?: LogMetadata) => {
			if (shouldLog(LogLevel.TRACE)) {
				const formattedMessage = formatMessage(LogLevel.TRACE, message, metadata)
				trace(formattedMessage)
				logToBrowserConsole(LogLevel.TRACE, formattedMessage, metadata)
			}
		},
		debug: (message: string, metadata?: LogMetadata) => {
			if (shouldLog(LogLevel.DEBUG)) {
				const formattedMessage = formatMessage(LogLevel.DEBUG, message, metadata)
				debug(formattedMessage)
				logToBrowserConsole(LogLevel.DEBUG, formattedMessage, metadata)
			}
		},
		info: (message: string, metadata?: LogMetadata) => {
			if (shouldLog(LogLevel.INFO)) {
				const formattedMessage = formatMessage(LogLevel.INFO, message, metadata)
				info(formattedMessage)
				logToBrowserConsole(LogLevel.INFO, formattedMessage, metadata)
			}
		},
		warn: (message: string, metadata?: LogMetadata) => {
			if (shouldLog(LogLevel.WARN)) {
				const formattedMessage = formatMessage(LogLevel.WARN, message, metadata)
				warn(formattedMessage)
				logToBrowserConsole(LogLevel.WARN, formattedMessage, metadata)
			}
		},
		error: (message: string, metadata?: LogMetadata) => {
			if (shouldLog(LogLevel.ERROR)) {
				const formattedMessage = formatMessage(LogLevel.ERROR, message, metadata)
				error(formattedMessage)
				logToBrowserConsole(LogLevel.ERROR, formattedMessage, metadata)
			}
		},
		setLogLevel: (level: LogLevel) => {
			currentLevel = level
		},
		toggleConsoleLogging: (enabled: boolean) => {
			consoleLogging = enabled
		},
	}
}

// Экспорт типов
export type { LogMetadata, ILogger, LoggerConfig }

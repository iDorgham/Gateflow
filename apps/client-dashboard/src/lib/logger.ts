type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const getTimestamp = () => new Date().toISOString();

const formatMessage = (level: LogLevel, message: string) => {
  return `[${getTimestamp()}] [${level.toUpperCase()}] ${message}`;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(formatMessage('info', message), ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(formatMessage('warn', message), ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(formatMessage('error', message), ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('debug', message), ...args);
    }
  },
};

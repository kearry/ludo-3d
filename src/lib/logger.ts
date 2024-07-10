let isLoggingEnabled = process.env.DEBUG||true;

export const setLogging = (enabled: boolean) => {
  isLoggingEnabled = enabled;
};

export const log = (message: string) => {
  if (isLoggingEnabled) {
    console.log(message);
  }
};
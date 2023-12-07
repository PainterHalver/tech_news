export const log = (message: string) => {
  process.stdout.write(message);
};

export const log_success = (message: string) => {
  log("\x1b[32m" + message + "\x1b[0m");
};

export const log_error = (message: string) => {
  log("\x1b[31m" + message + "\x1b[0m");
};

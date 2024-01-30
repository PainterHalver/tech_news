export const log = (message: string) => {
  process.stdout.write(message);
};

export const log_success = (message: string) => {
  log("\x1b[32m" + message + "\x1b[0m");
};

export const log_error = (message: string) => {
  log("\x1b[31m" + message + "\x1b[0m");
};

export const sendTelegramMessage = async (message: string) => {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
  }
};

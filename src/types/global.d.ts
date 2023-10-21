declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SLACK_BOT_TOKEN: string;
      SLACK_USER_TOKEN: string;
      TODELETE_CHANNEL_ID: string;
      REDIS_DB_URL: string;
      PORT: string;
    }
  }
}

export {};
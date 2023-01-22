declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SLACK_BOT_TOKEN: string;
      SLACK_USER_TOKEN: string;
      ANTISPAMERS_CHANNEL_ID: string;
      MODERATORS_CHANNEL_ID: string;
      TODELETE_CHANNEL_ID: string;
      BRAINLY_AUTH_TOKEN: string;
      REDIS_DB_URL: string;
    }
  }
}

export {};
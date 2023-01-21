declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SLACK_BOT_TOKEN: string;
      ANTISPAMERS_CHANNEL_ID: string;
      MODERATORS_CHANNEL_ID: string;
      BRAINLY_AUTH_TOKEN: string;
    }
  }
}

export {};
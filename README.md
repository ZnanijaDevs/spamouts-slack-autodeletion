## spamouts-slack-autodeletion

This is an app for the SpamOuts workspace that deletes messages in `#to-delete`.

Create an .env file, then run `npm run dev`

```
# .env
PORT=3001
REDIS_DB_URL=redis://user:pass@host.com:port/0
SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxxxx
TODELETE_CHANNEL_ID=CXXXXXX
```
## spamouts-slack-autodeletion

This is a serverless cron-based app for [our workspace](https://spamouts.slack.com) that
- deletes messages in #antispamers
- deletes messages in #moderators

### How to run
```bash
$ npm install -g serverless
$ npm install
$ serverless config credentials --provider aws --key "<ACCESS_KEY_ID>" --secret "<ACCESS_KEY>"
$ serverless invoke local -f "functionName"
```

- Install npm dependencies, Serverless and set AWS credentials
- Set environment variables in `env.dev.json` and `env.prod.json`
```jsonc
{
  "ANTISPAMERS_CHANNEL_ID": "C02DE6LKQLR",
  "MODERATORS_CHANNEL_ID": "C03KLBS5S94",
  "BRAINLY_AUTH_TOKEN": "<token>",
  "SLACK_BOT_TOKEN": "xoxb-...", // use this token to delete messages posted by the bot
  "SLACK_USER_TOKEN": "xoxp-..." // use this token to add reactions to messages
}
```
- Use `serverless invoke local` and `serverless offline start` to invoke functions in the local environment

### Deploy
_You will need an AWS account to run this app in production_
```bash
$ serverless deploy --stage prod
```
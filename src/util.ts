import type { Message } from "@slack/web-api/dist/response/ChannelsHistoryResponse";

export const getBotMessagesWithQuestionIds = (messages: Message[]) => {
  return messages
    .filter(message => "bot_id" in message)
    .map(message => {
      //console.log(message); // TODO: remove this block

      return {
        questionId: +/(?<=\/task\/)\d+/.exec(message.text),
        ts: message.ts,
      };
    })
    .filter(message => !!message.questionId);
}
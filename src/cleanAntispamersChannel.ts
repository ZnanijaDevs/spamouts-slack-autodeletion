import type { APIGatewayEvent } from "aws-lambda";
import type { Message } from "@slack/web-api/dist/response/ChannelsHistoryResponse";

import { getQuestions } from "./brainly";
import { slackClient } from "./slack";
import { getBotMessagesWithQuestionIds } from "./util";

export async function cleanAntispamersChannel(event: APIGatewayEvent) {
  const history = await slackClient.paginate("conversations.history", {
    channel: process.env.ANTISPAMERS_CHANNEL_ID
  });

  for await (let page of history) {
    let messages = getBotMessagesWithQuestionIds(page.messages as Message[]);
    let questions = await getQuestions(messages.map(message => message.questionId));

    for await (let question of questions) {
      if (question.hasReports) continue;

      let messageTimestamp = messages.find(message => message.questionId === question.id).ts;
  
      await slackClient.chat.delete({
        channel: process.env.ANTISPAMERS_CHANNEL_ID,
        ts: messageTimestamp
      });
    }
  }

  return "Deleted successfully.";
}
import type { APIGatewayEvent } from "aws-lambda";
import { slackClient } from "./slack";
import redis from "./redis";

const MIN_USER_ID = 3;
const MAX_USER_ID = Number.MAX_SAFE_INTEGER;
const REACTION_NAME = "magic_wand";

const response = (statusCode: number, body?: string | object) => {
	return {
		statusCode,
		body: typeof body === "string" ? body : JSON.stringify(body)
	}
}

export async function deleteMessageByUserId(event: APIGatewayEvent) {
  let body = event.body ? JSON.parse(event.body) : event;
  let userId: number = body.userId;

  if (typeof userId !== "number" || userId < MIN_USER_ID || userId > MAX_USER_ID) {
    return response(422, "Invalid user ID");
  }

  let matchedKeys = await redis.keys(`td:${userId}:*`); // example: ["td:27774835:1674382867.417149"]
  if (!matchedKeys.length) return response(204);

  for await (let key of matchedKeys) {
  	let messageTimestamp = key.split(":").at(-1);

  	try {
  		await slackClient.reactions.add({
				token: process.env.SLACK_USER_TOKEN,
  			timestamp: messageTimestamp,
  			name: REACTION_NAME,
  			channel: process.env.TODELETE_CHANNEL_ID
  		});
  	} catch (err) {
  		console.error(`Failed to add a reaction to message ${messageTimestamp}. Error: ${err}`)
  	}
  }

  return response(200);
}
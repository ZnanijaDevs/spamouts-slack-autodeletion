import type { Request, Response } from "express";
import HttpStatusCode from "http-status-codes";
import { slackClient } from "./slack";
import redis from "./redis";

const MIN_USER_ID = 3;
const MAX_USER_ID = Number.MAX_SAFE_INTEGER;
const REACTION_NAME = "magic_wand";

export async function deleteMessageByUserId(req: Request<{}, {}, { userId: number }>, res: Response) {
  let userId = req.body?.userId;

  if (typeof userId !== "number" || userId < MIN_USER_ID || userId > MAX_USER_ID) {
    return res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).send("invalid user id");
  }

  let matchedKeys = await redis.keys(`td:${userId}:*`); // example: ["td:27774835:1674382867.417149"]

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
  		console.error(`Failed to add a reaction to message ${messageTimestamp}`, err);
  	}
  }

  return res.status(HttpStatusCode.OK).send(`ok. matched ${matchedKeys.length} messages`);
}
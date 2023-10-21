import * as dotenv from "dotenv";
dotenv.config();

import * as express from "express";
import * as cors from "cors";

import { deleteMessageByUserId } from "./deleteMessageByUserId";

const app = express();

app.use(cors());
app.use(express.text());
app.use(express.json());

app.post("/deleteMessageByUserId", deleteMessageByUserId.bind(deleteMessageByUserId));

const port = +process.env.PORT;
app.listen(port, () => console.info(`listening on port ${port}`));
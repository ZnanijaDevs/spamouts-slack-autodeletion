import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_DB_URL);

export default redis;
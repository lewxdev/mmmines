import { Redis } from "ioredis";
import type { SessionState } from "@/types";

const fieldKey = "field:data";
const sessionKey = "user:sessions";

const createHelper =
  <TArgs extends unknown[], TReturn>(
    callback: (redis: Redis, ...args: TArgs) => TReturn,
  ) =>
  (...args: TArgs) => {
    const redis = new Redis(process.env["REDIS_URL"]!, { family: 6 });
    return callback(redis, ...args);
  };

export const decodeData = createHelper(async (redis) => {
  const value = await redis.get(fieldKey);
  if (typeof value !== "string" || !value) {
    throw new Error(`unexpected data on key: ${fieldKey}`);
  }
  return Array.from(value, (char) => char.charCodeAt(0));
});

export const encodeData = createHelper(async (redis, value: number[]) => {
  const binaryString = Buffer.from(value).toString("binary");
  await redis.set(fieldKey, binaryString);
  return value;
});

export const getSession = createHelper(async (redis, id: string) => {
  const value = await redis.hget(sessionKey, id);
  return value === "alive" || value === "dead" ? value : null;
});

export const setSession = createHelper(
  async (redis, id: string, state: SessionState) => {
    return redis.hset(sessionKey, id, state);
  },
);

export const resetSessions = createHelper(async (redis) => {
  const sessions = await redis.hkeys(sessionKey);
  const args = sessions.flatMap((sessionId) => [sessionId, "alive"]);
  return redis.hset(sessionKey, ...args);
});

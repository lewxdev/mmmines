import { Redis } from "ioredis";
import _ from "lodash";

const fieldKey = "field:data";
const sessionKey = "user:sessions";

const redis = new Redis(process.env["REDIS_URL"]!, { family: 6 });

export async function decodeData() {
  const value = await redis.get(fieldKey);
  if (typeof value !== "string" || !value) {
    throw new Error(`unexpected data on key: ${fieldKey}`);
  }
  return Array.from(value, (char) => char.charCodeAt(0));
}

export async function encodeData(value: number[]) {
  const binaryString = Buffer.from(value).toString("binary");
  await redis.set(fieldKey, binaryString);
  return value;
}

export async function getSession(sessionId: string) {
  const value = await redis.hget(sessionKey, sessionId);
  return value === "alive" || value === "dead" ? value : null;
}

export async function startSession(sessionId: string) {
  return redis.hset(sessionKey, sessionId, "alive");
}

export async function killSession(sessionId: string) {
  return redis.hset(sessionKey, sessionId, "dead");
}

export async function reviveSessions() {
  const sessions = await redis.hkeys(sessionKey);
  const args = sessions.flatMap((sessionId) => [sessionId, "alive"]);
  redis.hset(sessionKey, ...args);
}

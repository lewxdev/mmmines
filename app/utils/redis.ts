import { Redis } from "ioredis";
import type { SessionState } from "@/types";

const fieldKey = "field:data";
const sessionKey = "user:sessions";

function getClient() {
  return new Redis(process.env["REDIS_URL"]!, { family: 6 });
}

export async function decodeData() {
  const redis = getClient();
  const value = await redis.get(fieldKey);
  if (typeof value !== "string" || !value) {
    throw new Error(`unexpected data on key: ${fieldKey}`);
  }
  return Array.from(value, (char) => char.charCodeAt(0));
}

export async function encodeData(value: number[]) {
  const redis = getClient();
  const binaryString = Buffer.from(value).toString("binary");
  await redis.set(fieldKey, binaryString);
  return value;
}

export async function getSession(id: string) {
  const redis = getClient();
  const value = await redis.hget(sessionKey, id);
  return value === "alive" || value === "dead" ? value : null;
}

export async function setSession(id: string, state: SessionState) {
  const redis = getClient();
  return redis.hset(sessionKey, id, state);
}

export async function resetSessions() {
  const redis = getClient();
  const sessions = await redis.hkeys(sessionKey);
  const args = sessions.flatMap((sessionId) => [sessionId, "alive"]);
  return redis.hset(sessionKey, ...args);
}

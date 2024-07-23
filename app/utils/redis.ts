import { Redis } from "ioredis";
import _ from "lodash";

const key = "field:data";

function getClient() {
  return new Redis(process.env["REDIS_URL"]!, { family: 6 });
}

export async function decodeData() {
  const redis = getClient();
  const value = await redis.get(key);
  if (typeof value !== "string" || !value) {
    throw new Error(`unexpected data on key: ${key}`);
  }
  return Array.from(value, (char) => char.charCodeAt(0));
}

export async function encodeData(value: number[]) {
  const redis = getClient();
  const binaryString = Buffer.from(value).toString("binary");
  await redis.set(key, binaryString);
  return value;
}

import _ from "lodash";
import { Redis } from "@upstash/redis";
import "dotenv/config";

const redis = Redis.fromEnv();
const key = "field:data";

export async function decodeData() {
  const value = await redis.get(key);
  if (typeof value !== "string" || !value) {
    throw new Error(`unexpected data on key: ${key}`);
  }
  return Array.from(value, (char) => char.charCodeAt(0));
}

export async function encodeData(value: number[]) {
  const binaryString = Buffer.from(value).toString("binary");
  await redis.set(key, binaryString);
  return value;
}

export function getDebouncedSetBit() {
  let bitfield = redis.bitfield(key);
  const debouncedExec = _.debounce(async () => {
    const response = await bitfield.exec();
    bitfield = redis.bitfield(key);
    return response;
  }, 1000);
  return (offset: number, value: number) => {
    bitfield.set("u8", `#${offset}`, value);
    return debouncedExec();
  };
}

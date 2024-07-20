import { Redis } from "@upstash/redis";
import _ from "lodash";
import "dotenv/config";

const client = Redis.fromEnv();
const key = "field:data";

export namespace redis {
  export async function decodeData() {
    const value = await client.get(key);
    if (typeof value !== "string" || !value) {
      throw new Error(`unexpected data on key: ${key}`);
    }
    return Array.from(value, (char) => char.charCodeAt(0));
  }

  export async function encodeData(value: number[]) {
    const binaryString = Buffer.from(value).toString("binary");
    await client.set(key, binaryString);
    return value;
  }

  export function getDebouncedSetBit() {
    let bitfield = client.bitfield(key);
    const debouncedExec = _.debounce(async () => {
      const response = await bitfield.exec();
      bitfield = client.bitfield(key);
      return response;
    }, 1000);
    return (offset: number, value: number) => {
      bitfield.set("u8", `#${offset}`, value);
      return debouncedExec();
    };
  }
}

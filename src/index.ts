import { Redis } from "@upstash/redis/cloudflare";
import { Hono } from "hono";
import { env } from "hono/adapter";

type Env = {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
};

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Cloudflare Workers!");
});

app.get("/board", async (c) => {
  const vars = env<Env>(c);
  const redis = Redis.fromEnv(vars);
  await redis.set("board", "foo bar");
  const board = await redis.get("board");
  return c.text(board as string);
});

export default app;

import { Redis } from "@upstash/redis/cloudflare";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { Fragment } from "hono/jsx";
import { renderer } from "./renderer";

type Env = {
	UPSTASH_REDIS_REST_URL: string;
	UPSTASH_REDIS_REST_TOKEN: string;
};

const app = new Hono();

app.get("*", renderer);

// todo: add ssr / suspense here
app.get("/", async (c) => c.render(<Fragment />));

app.get("/board", async (c) => {
	const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env<Env>(
		c,
		"workerd",
	);
	const redis = Redis.fromEnv({
		UPSTASH_REDIS_REST_URL,
		UPSTASH_REDIS_REST_TOKEN,
	});
	await redis.set("board", "foo bar");
	const board = await redis.get("board");
	return c.text(board as string);
});

export default app;

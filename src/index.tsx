import { Redis } from "@upstash/redis/cloudflare";
import { Hono } from "hono";
import { env } from "hono/adapter";

type Env = {
	UPSTASH_REDIS_REST_URL: string;
	UPSTASH_REDIS_REST_TOKEN: string;
};

const app = new Hono();

app.get("/", (c) => {
	return c.html(
		<html>
			<head>
				<title>mmmines</title>
				<script crossOrigin src="https://cdn.twind.style"></script>
			</head>
			<body>
				<p className="text-gray-900 underline dark:text-gray-100">
					Hello Cloudflare Workers!
				</p>
			</body>
		</html>,
	);
});

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

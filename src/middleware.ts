import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import Redis from "ioredis";

type Env = {
	UPSTASH_REDIS_URI: string;
};

export const redis = () =>
	createMiddleware(async (c, next) => {
		const { UPSTASH_REDIS_URI } = env<Env>(c, "workerd");
		const redis = new Redis(UPSTASH_REDIS_URI);

		c.set("redis", redis);

		await next();
	});

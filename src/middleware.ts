import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import Redis from "ioredis";

type Env = {
	UPSTASH_REDIS_REST_TOKEN: string;
};

export const redis = () =>
	createMiddleware(async (c, next) => {
		const { UPSTASH_REDIS_REST_TOKEN } = env<Env>(c, "workerd");
		const redis = new Redis(
			`rediss://default:${UPSTASH_REDIS_REST_TOKEN}@allowing-muskox-49551.upstash.io:6379`,
		);

		c.set("redis", redis);

		await next();
	});

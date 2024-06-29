import { env } from "hono/adapter";
import { createMiddleware } from "hono/factory";
import { Redis } from "@upstash/redis/cloudflare";

type Env = {
	UPSTASH_REDIS_REST_URL: string;
	UPSTASH_REDIS_REST_TOKEN: string;
};

export const redis = () =>
	createMiddleware(async (c, next) => {
		const { UPSTASH_REDIS_REST_URL: url, UPSTASH_REDIS_REST_TOKEN: token } =
			env<Env>(c, "workerd");
		c.set("redis", new Redis({ url, token }));
		await next();
	});

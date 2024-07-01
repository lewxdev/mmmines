import { type Redis } from "@upstash/redis";

declare module "hono" {
	interface ContextVariableMap {
		redis: Redis;
	}
}

import Redis from "ioredis";

declare module "hono" {
	interface ContextVariableMap {
		redis: Redis;
	}
}

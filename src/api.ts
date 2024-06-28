import { Hono } from "hono";
import _ from "lodash";

export const api = new Hono();

api.get("/field", async (c) => {
	const redis = c.get("redis");
	const field = await redis.get("field");
	return c.json({ field });
});

api.get("/field/seed", async (c) => {
	const redis = c.get("redis");
	await redis.set("field", Buffer.from(_.times(5000, () => _.random(9))));
	return c.json({ result: await redis.get("field") });
});

api.get("/field/:offset", async (c) => {
	const redis = c.get("redis");
	const offset = c.req.param("offset");
	const value = await redis.bitfield("field", "GET", "u8", `#${offset}`);
	return c.json({ result: value });
});

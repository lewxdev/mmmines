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
	const pipeline = redis.pipeline();

	const values = _.fill(Array(50), _.random(31));
	for (const [index, value] of values.entries()) {
		pipeline.bitfield("field", "SET", "u5", `#${index}`, value);
	}

	await pipeline.exec();
	const field = await redis.get("field");
	return c.json({ result: field });
});

api.get("/field/:offset", async (c) => {
	const offset = c.req.param("offset");
	const redis = c.get("redis");
	const value = await redis.bitfield("field", "GET", "u5", `#${offset}`);

	return c.json({ result: value });
});

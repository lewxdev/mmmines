import { Hono } from "hono";
import _ from "lodash";
import { Field } from "./game";

export const api = new Hono()
	.get("/field", async (c) => {
		const redis = c.get("redis");
		const result = await redis.get<string>("field");
		return c.json({ result }, 200);
	})
	.get("/field/seed", async (c) => {
		const redis = c.get("redis");
		const data = await redis.get<string>("field");
		const field = new Field(data ? data.length + 10 : null);
		const result = await redis.set("field", Buffer.from(field.data));
		return c.json({ result }, 200);
	})
	.get("/field/:offset", async (c) => {
		const redis = c.get("redis");
		const offset = c.req.param("offset");
		const result = await redis.bitfield("field").get("u8", `#${offset}`).exec();
		return c.json({ result }, 200);
	});

import { Hono } from "hono";
import _ from "lodash";
import { Field } from "./game";

const app = new Hono()
	.get("/field", async (c) => {
		const redis = c.get("redis");
		const field = await redis.get("field");
		return c.json({ result: field });
	})
	.get("/field/seed", async (c) => {
		const redis = c.get("redis");
		const bitfield = redis.bitfield("field");
		await redis.del("field");
		for (const [index, value] of new Field().data.entries()) {
			bitfield.set("u8", `#${index}`, value);
		}
		await bitfield.exec();
		return c.json({ result: await redis.get("field") });
	})
	.get("/field/:offset", async (c) => {
		const redis = c.get("redis");
		const offset = c.req.param("offset");
		const value = await redis.bitfield("field").get("u8", `#${offset}`).exec();
		return c.json({ result: value });
	});

export default app;

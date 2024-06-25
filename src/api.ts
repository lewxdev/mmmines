import { Hono } from "hono";

export const api = new Hono();

api.get("/board", async (c) => {
	const redis = c.get("redis");
	const board = await redis.get("board");
	return c.json({ board });
});

api.get("/board/:offset", async (c) => {
	const offset = c.req.param("offset");
	const redis = c.get("redis");
	const board = await redis.bitfield("board", "GET", "u8", offset);

	return c.json({ board });
});

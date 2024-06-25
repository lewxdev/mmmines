import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	return c.html("Hello Cloudflare Workers!");
});

export default app;

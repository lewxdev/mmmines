import { Hono } from "hono";
import { upgradeWebSocket } from "hono/cloudflare-workers";
import { Fragment } from "hono/jsx";
import { api } from "./api";
import { redis } from "./middleware";
import { renderer } from "./renderer";
import { websocket } from "./websocket";

const app = new Hono()
	.use("*", renderer)
	.get("/", (c) => c.render(<Fragment />)) // todo: add ssr / suspense here
	.use("/api/field/*", redis)
	.route("/api", api)
	.get(
		"/ws",
		upgradeWebSocket(() => {
			return {
				onMessage(event, ws) {
					ws.send("hello!");
				},
				onError(evt, ws) {
					console.error(evt);
				},
			};
		}),
	);

export default app;

export type AppType = typeof app;

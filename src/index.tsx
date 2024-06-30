import { Hono } from "hono";
import { Fragment } from "hono/jsx";
import { api } from "./api";
import { websocket } from "./websocket";
import { redis } from "./middleware";
import { renderer } from "./renderer";
import { upgradeWebSocket } from "hono/cloudflare-workers";

const app = new Hono();

app.get("*", renderer);
app.get("/", (c) => c.render(<Fragment />)); // todo: add ssr / suspense here

app.use("/api/field/*", redis());

app.route("/api", api);
app.get(
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

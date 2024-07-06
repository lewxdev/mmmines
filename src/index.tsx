import { Hono } from "hono";
import { Fragment } from "hono/jsx";
import { api } from "./api";
import { redis } from "./middleware";
import { renderer } from "./renderer";
import { webSocket } from "./websocket";

const app = new Hono()
	.use("*", renderer)
	.get("/", (c) => c.render(<Fragment />)) // todo: add ssr / suspense here
	.use("/api/field/*", redis)
	.route("/api", api)
	.get("/ws", webSocket);

export default app;

export type AppType = typeof app;

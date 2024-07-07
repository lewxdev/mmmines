import { Hono } from "hono";
import { Fragment } from "hono/jsx";
import { api } from "./api";
import { redis } from "./middleware";
import { renderer } from "./renderer";

const app = new Hono()
	.use("*", renderer)
	.get("/", (c) => c.render(<Fragment />)) // todo: add ssr / suspense here
	.use("/api/field/*", redis)
	.route("/api", api);

export default app;

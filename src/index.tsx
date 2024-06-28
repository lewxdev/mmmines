import { Hono } from "hono";
import { Fragment } from "hono/jsx";
import { api } from "./api";
import { redis } from "./middleware";
import { renderer } from "./renderer";

const app = new Hono();

app.get("*", renderer);
app.get("/", (c) => c.render(<Fragment />)); // todo: add ssr / suspense here

app.use("/api/field/*", redis());
app.route("/api", api);

export default app;

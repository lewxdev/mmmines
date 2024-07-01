import { Hono } from "hono";
import { Fragment } from "hono/jsx";
import api from "./api";
import { redis } from "./middleware";
import { renderer } from "./renderer";

const app = new Hono();

app.use(renderer);
app.use("/api/field/*", redis());

// must be chained so types are inferred
const routes = app.get("/", (c) => c.render(<Fragment />)).route("/api", api);

export type AppType = typeof routes;
export default app;

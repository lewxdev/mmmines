import pages from "@hono/vite-cloudflare-pages";
import adapter from "@hono/vite-dev-server/cloudflare";
import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
	if (mode === "client") {
		return {
			build: {
				rollupOptions: {
					input: "./src/client.tsx",
					output: {
						entryFileNames: "static/[name].js",
					},
				},
				target: "esnext",
			},
		};
	}
	return {
		plugins: [
			pages(),
			devServer({
				adapter,
				entry: "src/index.tsx",
			}),
		],
	};
});

import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import cloudflareAdapter from "@hono/vite-dev-server/cloudflare";

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
			},
		};
	}
	return {
		plugins: [
			devServer({
				adapter: cloudflareAdapter,
				entry: "src/index.tsx",
			}),
		],
	};
});

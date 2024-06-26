import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import cloudflareAdapter from "@hono/vite-dev-server/cloudflare";
import viteCloudflarePages from "@hono/vite-cloudflare-pages";

export default defineConfig(({ mode }) => {
	if (mode === "client") {
		return {
			build: {
				rollupOptions: {
					input: "./src/client.tsx",
					output: {
						entryFileNames: "static/client.js",
					},
				},
			},
		};
	}
	return {
		plugins: [
			viteCloudflarePages(),
			devServer({
				adapter: cloudflareAdapter,
				entry: "src/index.tsx",
			}),
		],
	};
});

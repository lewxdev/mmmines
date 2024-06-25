import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	return c.html(
		<html>
			<head>
				<title>mmmines</title>
				<script crossOrigin src="https://cdn.twind.style"></script>
			</head>
			<body>
				<p className="text-gray-900 underline dark:text-gray-100">
					Hello Cloudflare Workers!
				</p>
			</body>
		</html>,
	);
});

export default app;

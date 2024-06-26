import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
	return (
		<html>
			<head>
				<link href="/static/style.css" rel="stylesheet" />
				<title>mmmines</title>
				<script crossOrigin src="https://cdn.twind.style"></script>
				<script
					type="module"
					// @ts-ignore
					src={import.meta.env.PROD ? "/static/client.js" : "/src/client.tsx"}
				/>
			</head>
			<body>
				{children}
				<div id="app-root" />
			</body>
		</html>
	);
});

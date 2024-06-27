import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
	return (
		<html>
			<head>
				<title>mmmines</title>
				<script crossOrigin src="https://cdn.twind.style"></script>
				<script
					type="module"
					src={import.meta.env.PROD ? "/static/client.js" : "/src/client.tsx"}
				/>
			</head>
			<body>
				{children}
				<main id="app" />
			</body>
		</html>
	);
});

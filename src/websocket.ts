import { upgradeWebSocket } from "hono/cloudflare-workers";
import { type WSContext } from "hono/ws";

export const webSocket = upgradeWebSocket(() => {
	const clients = new Set<WSContext>();

	return {
		onMessage: (event, ws) => {
			const source = event.data.toString();

			switch (source) {
				case "connected":
					console.log("connection opened");
					clients.add(ws);
					break;

				default:
					console.log(`received: "${source}"`);
					clients.forEach((client) => {
						if (client.readyState === WebSocket.OPEN) {
							client.send(source);
						}
					});
					break;
			}
		},
		onClose: (_, ws) => {
			console.log("connection closed");
			clients.delete(ws);
		},
	};
});

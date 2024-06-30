import { Hono } from "hono";
import { upgradeWebSocket } from "hono/cloudflare-workers";

export const websocket = new Hono();

let clients = 0;

websocket.get(
	"/",
	upgradeWebSocket(() => {
		return {
			onMessage: (event, ws) => {
				console.log(event.type);
				console.log(event.data);
				ws.send("hello from the server");
			},
			onClose: () => {
				console.log("Connection closed");
			},
		};
	}),
);

export type WebSocketApp = typeof websocket;

import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "@/types";
import { Field } from "../utils/game";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

async function main() {
  const app = next({ dev, hostname, port });
  await app.prepare();

  const httpServer = createServer(app.getRequestHandler());
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

  const field = await Field.fromRedis();
  io.on("connection", (socket) => {
    socket.emit("update", field.cells);

    socket.on("expose", (index) => {
      field.exposeCell(index);
      io.emit("update", field.cells);
    });

    socket.on("flag", (index) => {
      field.flagCell(index);
      io.emit("update", field.cells);
    });
  });

  httpServer.once("error", onError).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}

main().catch(onError);

function onError(error: unknown) {
  console.error(error);
  process.exit(1);
}

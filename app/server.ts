import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "@/types";
import { Field } from "@/utils/game";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

async function main() {
  const app = next({ dev, hostname, port });
  await app.prepare();

  const httpServer = createServer(app.getRequestHandler());
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);

  let field = await Field.fromRedis();
  field = await field.handleComplete();

  io.on("connection", (socket) => {
    socket.emit("update", field.plots);

    socket.on("expose", async (index) => {
      field.exposeCell(index);
      field = await field.handleComplete();
      io.emit("update", field.plots);
    });

    socket.on("flag", async (index) => {
      field.flagCell(index);
      field = await field.handleComplete();
      io.emit("update", field.plots);
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

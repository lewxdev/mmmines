import crypto from "crypto";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import type { SocketServer } from "@/types";
import { Field } from "@/utils/game";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const sessions = new Map<string, "alive" | "dead">();

async function main() {
  const app = next({ dev, hostname, port });
  await app.prepare();

  const httpServer = createServer(app.getRequestHandler());
  const io: SocketServer = new Server(httpServer);

  let clientsCount = 0;

  let field = await Field.fromRedis();
  field = await field.handleComplete();

  io.use(async (socket, next) => {
    const { sessionID } = socket.handshake.auth;
    if (sessionID) {
      if (sessions.get(sessionID) === "dead") {
        return next(new Error("dead"));
      }
      socket.data.sessionID = sessionID;
      return next();
    }

    socket.data.sessionID = crypto.randomBytes(8).toString("hex");
    next();
  });

  io.on("connection", (socket) => {
    sessions.set(socket.data.sessionID, "alive");

    socket.emit("session", {
      sessionID: socket.data.sessionID,
    });

    clientsCount++;
    io.emit("clientsCount", clientsCount);
    io.emit("exposedPercent", field.exposedPercent);
    socket.emit("update", field.plots);

    socket.on("expose", async (index) => {
      field.exposeCell(index);
      field = await field.handleComplete();
      io.emit("exposedPercent", field.exposedPercent);
      io.emit("update", field.plots);
    });

    socket.on("flag", async (index) => {
      field.flagCell(index);
      field = await field.handleComplete();
      io.emit("update", field.plots);
    });

    socket.on("disconnect", () => {
      clientsCount--;
      io.emit("clientsCount", clientsCount);
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

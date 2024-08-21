import crypto from "crypto";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import type { SocketServer } from "@/types";
import { Field } from "@/utils/game";
import * as redis from "@/utils/redis";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

async function main() {
  const app = next({ dev, hostname, port });
  await app.prepare();

  const httpServer = createServer(app.getRequestHandler());
  const io: SocketServer = new Server(httpServer);

  let clientsCount = 0;
  let field = await Field.fromRedis();

  io.use(async (socket, next) => {
    const { sessionId } = socket.handshake.auth;
    const sessionState = await redis.getSession(sessionId);
    if (sessionState === "dead") {
      return next(new Error("dead"));
    }
    socket.data.sessionId = sessionState
      ? sessionId
      : crypto.randomBytes(8).toString("hex");
    next();
  });

  io.on("connection", async (socket) => {
    await redis.setSession(socket.data.sessionId, "alive");
    socket.emit("sessionAlive", socket.data.sessionId);

    clientsCount++;
    io.emit("clientsCount", clientsCount);
    io.emit("exposedPercent", field.exposedPercent);
    socket.emit("update", field.plots);

    socket.on("expose", async (index) => {
      if (field.exposeCell(index) === "dead") {
        await redis.setSession(socket.data.sessionId, "dead");
        socket.emit("sessionDead");
      } else if (field.isComplete) {
        field = await Field.create(field.size + 10);
        await redis.resetSessions();
      }
      io.emit("exposedPercent", field.exposedPercent);
      io.emit("update", field.plots);
    });

    socket.on("flag", async (index) => {
      field.flagCell(index);
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

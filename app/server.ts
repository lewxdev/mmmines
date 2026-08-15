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
  const app = next({ dev, hostname, port, webpack: true });
  await app.prepare();
  const devFieldSize = getDevFieldSize();
  const httpServer = createServer(app.getRequestHandler());
  const io: SocketServer = new Server(httpServer);
  let field = await Field.fromRedis(devFieldSize);

  // middleware on incoming connection (see: https://socket.io/docs/v4/server-api/#serverusefn)
  // handles "authentication" and manages *initial* session data
  // note:
  // * socket is not connected when this runs
  // * only executed once per connection
  io.use(async (socket, next) => {
    const { sessionId } = socket.handshake.auth;
    socket.data = await redis.getSession(sessionId);
    next();
  });

  // client connects (or reconnects)
  io.on("connection", async (socket) => {
    // update client count for all clients
    io.emit("clientsCount", io.engine.clientsCount);

    // send initial data to newly connected client
    socket.emit("session", socket.data.sessionId);
    socket.emit("sessionState", socket.data.sessionState);
    socket.emit("newSession", socket.data.isNewSession);
    socket.emit("update", field.plots);
    socket.emit("exposedPercent", field.exposedPercent);

    // middleware on incoming event (see: https://socket.io/docs/v4/server-api/#socketusefn)
    // handles *subsequent* listeners, blocking events from dead sessions
    socket.use((event, next) => {
      if (socket.data.sessionState === "dead") {
        return next(new Error("dead", { cause: event }));
      }
      next();
    });

    // client event listeners

    socket.on("expose", async (index) => {
      if (field.exposeCell(index) === "dead") {
        await redis.setSession(socket.data.sessionId, "dead");
        // update session state and emit to client
        socket.emit("sessionState", (socket.data.sessionState = "dead"));
      } else if (field.isComplete) {
        field = await Field.create(devFieldSize ?? field.size + 10);
        await redis.resetSessions();
        // everyone is alive again 🎉
        io.emit("sessionState", "alive");
      }
      io.emit("exposedPercent", field.exposedPercent);
      io.emit("update", field.plots);
    });

    socket.on("flag", async (index) => {
      field.flagCell(index);
      io.emit("update", field.plots);
    });

    // client disconnects
    socket.on("disconnect", () => {
      io.emit("clientsCount", io.engine.clientsCount);
    });
  });

  httpServer.once("error", onError).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}

function getDevFieldSize() {
  const value = process.env["DEV_FIELD_SIZE"];
  if (!dev || value === undefined || value.trim() === "") {
    return undefined;
  }

  const size = Number(value);
  if (!Number.isSafeInteger(size) || size < 1) {
    throw new Error("DEV_FIELD_SIZE must be a positive integer");
  }
  return size;
}

main().catch(onError);

function onError(error: unknown) {
  console.error(error);
  process.exit(1);
}

import crypto from "crypto";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { createSessionStore } from "@/stores/sessionStore";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@/types";
import { Field } from "@/utils/game";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const randomId = () => crypto.randomBytes(8).toString("hex");

const sessionStore = createSessionStore();

async function main() {
  const app = next({ dev, hostname, port });
  await app.prepare();

  const httpServer = createServer(app.getRequestHandler());
  const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
    httpServer,
  );

  let clientsCount = 0;

  let field = await Field.fromRedis();
  field = await field.handleComplete();

  io.use(async (socket, next) => {
    const { sessionID } = socket.handshake.auth;
    if (sessionID) {
      const session = sessionStore.getSession(sessionID);
      if (session) {
        socket.data.sessionID = sessionID;
        socket.data.userID = session.userID;
        socket.data.username = session.username;
        return next();
      }
    }
    const { username } = socket.handshake.auth;
    if (!username) {
      return next(new Error("invalid username"));
    }

    socket.data.sessionID = randomId();
    socket.data.userID = randomId();
    socket.data.username = username;
    next();
  });

  io.on("connection", (socket) => {
    sessionStore.setSession(socket.data.sessionID, {
      userID: socket.data.userID,
      username: socket.data.username,
      connected: true,
    });

    socket.emit("session", {
      sessionID: socket.data.sessionID,
      userID: socket.data.userID,
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
      sessionStore.setSession(socket.data.sessionID, {
        userID: socket.data.userID,
        username: socket.data.username,
        connected: false,
      });
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

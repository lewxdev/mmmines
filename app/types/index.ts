import type { Server } from "socket.io";
import type { Socket } from "socket.io-client";
import type { Field } from "@/utils/game";

type ClientToServerEvents = {
  expose(index: number): void;
  flag(index: number): void;
};

export type ServerToClientEvents = {
  update(state: Field["plots"]): void;
  clientsCount(count: number): void;
  exposedPercent(count: number): void;
  sessionAlive(sessionId: string): void;
  sessionDead(): void;
};

type InterServerEvents = {};

type SocketData = {
  sessionId: string;
};

export type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

export type SocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

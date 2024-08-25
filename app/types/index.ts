import type { Server } from "socket.io";
import type { Socket } from "socket.io-client";
import type { Field } from "@/utils/game";

export type SessionState = "alive" | "dead";

type ClientToServerEvents = {
  expose(index: number): void;
  flag(index: number): void;
};

export type ServerToClientEvents = {
  update(state: Field["plots"]): void;
  clientsCount(count: number): void;
  exposedPercent(count: number): void;
  session(sessionId: string): void;
  sessionState(state: SessionState): void;
  newSession(isNewSession: boolean): void;
};

type InterServerEvents = {};

export type SocketData = {
  sessionId: string;
  sessionState: SessionState;
  isNewSession: boolean;
};

export type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

export type SocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

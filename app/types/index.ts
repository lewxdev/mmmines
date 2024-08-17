import type { Server } from "socket.io";
import type { Socket } from "socket.io-client";
import type { Field } from "@/utils/game";

export type ServerToClientEvents = {
  update(state: Field["plots"]): void;
  clientsCount(count: number): void;
  exposedPercent(count: number): void;
  session: (sessionID: string) => void;
};

type ClientToServerEvents = {
  expose(index: number): void;
  flag(index: number): void;
};

type SocketData = {
  sessionID: string;
  username: string;
};

type DefaultEventsMap = {
  [event: string]: (...args: any[]) => void;
};

export type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;

export type SocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
>;

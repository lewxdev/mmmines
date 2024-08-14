import type { Field } from "@/utils/game";

export type ServerToClientEvents = {
  update(state: Field["plots"]): void;
  clientsCount(count: number): void;
  exposedPercent(count: number): void;
  session: (session: { sessionID: string; userID: string }) => void;
};

export type ClientToServerEvents = {
  expose(index: number): void;
  flag(index: number): void;
};

export type SocketData = {
  sessionID: string;
  userID: string;
  username: string;
};

import type { Field } from "@/utils/game";

export type ServerToClientEvents = {
  update(state: Field["plots"]): void;
  clientsCount(count: number): void;
};

export type ClientToServerEvents = {
  expose(index: number): void;
  flag(index: number): void;
};

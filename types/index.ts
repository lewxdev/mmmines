import type { Cell } from "@/utils/game";

export interface ServerToClientEvents {
  update(state: Cell[]): void;
}

export interface ClientToServerEvents {
  expose(index: number): void;
  flag(index: number): void;
}

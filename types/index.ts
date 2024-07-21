import type { State } from "@/utils/game";

export interface ServerToClientEvents {
  update(state: State[]): void;
}

export interface ClientToServerEvents {
  expose(index: number): void;
  flag(index: number): void;
}

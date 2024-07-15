export interface ServerToClientEvents {
  message: (message: string, callback?: (message: string) => void) => void;
}

export interface ClientToServerEvents {
  message: (message: string) => void;
}

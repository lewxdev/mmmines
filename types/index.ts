export interface ServerToClientEvents {
  noArg: () => void;
  message: (message: string, callback?: (message: string) => void) => void;
}

export interface ClientToServerEvents {
  message: (message: string) => void;
}

export interface SocketData {
  name: string;
  age: number;
}

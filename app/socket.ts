"use client";

import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@/types";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false,
});

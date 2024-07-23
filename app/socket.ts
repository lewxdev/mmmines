"use client";

import type { ClientToServerEvents, ServerToClientEvents } from "@/types";
import { io, Socket } from "socket.io-client";

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;
export const socket: SocketType = io();

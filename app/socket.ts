"use client";

import { io } from "socket.io-client";
import type { SocketClient } from "@/types";

export const socket: SocketClient = io({ autoConnect: false });

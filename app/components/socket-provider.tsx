"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { SocketClient } from "@/types";

const SocketContext = createContext<SocketClient | null>(null);

export function useSocket() {
  const socketContext = useContext(SocketContext);
  if (!socketContext) {
    throw new Error("useSocket has to be used in SocketProvider");
  }
  return socketContext;
}

export function SocketProvider({ children }: React.PropsWithChildren) {
  const [socket] = useState<SocketClient>(() =>
    io({
      auth: (callback) => {
        callback({ sessionId: localStorage.getItem("sessionId") });
      },
    }),
  );

  useEffect(() => {
    socket.on("session", (sessionId) => {
      socket.auth = { sessionId };
      localStorage.setItem("sessionId", sessionId);
    });

    return () => {
      socket.off();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

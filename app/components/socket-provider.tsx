"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { SocketClient } from "@/types";

const socket: SocketClient = io({ autoConnect: false });

type SocketContextValue = {
  socket: SocketClient;
  sessionState: "alive" | "dead" | null;
};

const SocketContext = createContext<SocketContextValue | null>(null);

export function useSocket() {
  const socketContext = useContext(SocketContext);
  if (!socketContext) {
    throw new Error("useSocket has to be used in SocketProvider");
  }
  return socketContext;
}

export function SocketProvider({ children }: React.PropsWithChildren) {
  const [sessionState, setSessionState] = useState<"alive" | "dead" | null>(
    null,
  );

  useEffect(() => {
    socket.auth = { sessionId: localStorage.getItem("sessionId") };
    socket.connect();

    socket.on("connect_error", (error) => {
      if (error.message === "dead") {
        setSessionState("dead");
      }
    });

    socket.on("sessionAlive", (sessionId) => {
      socket.auth = { sessionId };
      localStorage.setItem("sessionId", sessionId);
      setSessionState("alive");
    });

    socket.on("sessionDead", () => {
      setSessionState("dead");
    });
  }, []);

  return (
    <SocketContext.Provider value={{ socket, sessionState }}>
      {children}
    </SocketContext.Provider>
  );
}

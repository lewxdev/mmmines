"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { SessionState, SocketClient } from "@/types";

const socket: SocketClient = io({ autoConnect: false });

type SocketContextValue = {
  socket: SocketClient;
  sessionState: SessionState | null;
  showTutorial: boolean;
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
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("sessionId")) {
      socket.auth = { sessionId: localStorage.getItem("sessionId") };
      setShowTutorial(false);
    }
    socket.connect();

    socket.on("connect_error", (error) => {
      if (error.message === "dead") {
        setSessionState("dead");
      }
    });

    socket.on("session", (sessionId) => {
      socket.auth = { sessionId };
      localStorage.setItem("sessionId", sessionId);
    });

    socket.on("sessionState", setSessionState);
  }, []);

  return (
    <SocketContext.Provider value={{ socket, sessionState, showTutorial }}>
      {children}
    </SocketContext.Provider>
  );
}

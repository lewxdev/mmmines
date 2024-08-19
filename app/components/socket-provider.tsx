"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { SocketClient } from "@/types";

const socket: SocketClient = io({ autoConnect: false });

const SocketContext = createContext({
  socket,
  isDead: false,
});

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }: React.PropsWithChildren) {
  const [isDead, setIsDead] = useState(false);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      socket.auth = { sessionID };
    }

    socket.connect();

    function onDisconnect() {
      console.log("disconnected");
    }

    socket.on("disconnect", onDisconnect);

    socket.on("session", ({ sessionID }) => {
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
    });

    socket.on("connect_error", (error) => {
      if (error.message === "dead") {
        setIsDead(true);
      }
    });

    return () => {
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isDead }}>
      {children}
    </SocketContext.Provider>
  );
}

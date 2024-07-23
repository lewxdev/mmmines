import { useEffect } from "react";
import type { SocketType } from "@/socket";
import type { ServerToClientEvents } from "@/types";

export const useEvent = (
  socket: SocketType,
  event: keyof ServerToClientEvents,
  callback: (...args: any[]) => void,
) => {
  useEffect(() => {
    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  }, [callback, event, socket]);
};

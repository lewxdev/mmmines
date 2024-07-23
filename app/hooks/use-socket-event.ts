import { useEffect, useState } from "react";
import { socket } from "@/socket";
import type { ServerToClientEvents } from "@/types";

export function useSocketEvent<K extends keyof ServerToClientEvents>(event: K) {
  const [result, setResult] = useState<
    Parameters<ServerToClientEvents[K]> | []
  >([]);

  useEffect(() => {
    const callback = ((...args: Parameters<ServerToClientEvents[K]>) => {
      setResult(args);
    }) as never; // unable to pass as a listener due to the socket.io types

    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  }, [event]);

  return result;
}

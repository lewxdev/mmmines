import { useEffect, useState } from "react";
import { useSocket } from "#app/components/socket-provider.tsx";
import type { ServerToClientEvents } from "#app/types/index.ts";

export function useSocketEvent<K extends keyof ServerToClientEvents>(event: K) {
  const socket = useSocket();
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
  }, [event, socket]);

  return result;
}

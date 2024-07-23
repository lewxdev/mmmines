import { useEffect, useState } from "react";
import { socket } from "@/socket";
import type { ServerToClientEvents } from "@/types";

export function useEvent<T extends keyof ServerToClientEvents>(event: T) {
  const [result, setResult] = useState<
    Parameters<ServerToClientEvents[T]> | []
  >([]);

  useEffect(() => {
    const callback = (...args: Parameters<ServerToClientEvents[T]>) => {
      setResult(args);
    };

    socket.on(event, callback as never);
    return () => {
      socket.off(event, callback as never);
    };
  }, [event]);

  return result;
}

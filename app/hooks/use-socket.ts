import { useEffect } from "react";
import { socket } from "@/socket";

export function useSocket() {
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("connected", socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport) => {
        console.log("upgraded", transport.name);
      });
    }

    function onDisconnect() {
      console.log("disconnected");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
}

import { useEffect } from "react";
import { socket } from "@/socket";

export function useSocket() {
  useEffect(() => {
    // if (socket.connected) {
    //   onConnect();
    // }

    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    }

    // function onConnect() {
    //   console.log("connected", socket.io.engine.transport.name);
    //   socket.io.engine.on("upgrade", (transport) => {
    //     console.log("upgraded", transport.name);
    //   });
    // }

    function onDisconnect() {
      console.log("disconnected");
    }

    // socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("session", (sessionID) => {
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
    });

    return () => {
      socket.off("disconnect", onDisconnect);
    };
  }, []);
}

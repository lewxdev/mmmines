"use client";

import { useEffect, useState } from "react";
import { socket } from "./socket";

export default function Page() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    function onMessage(message: string) {
      setMessages((messages) => [...messages, message]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
    };
  }, []);

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          socket.emit("message", text);
          setText("");
        }}
      >
        <input
          placeholder="Enter a message"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}

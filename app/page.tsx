"use client";

import { useEffect, useState } from "react";
import { socket } from "./socket";
import useSocket from "@/hooks/useSocket";

export default function Page() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const { isConnected, transport } = useSocket();

  useEffect(() => {
    function onMessage(message: string) {
      setMessages((messages) => [...messages, message]);
    }

    socket.on("message", onMessage);

    return () => {
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

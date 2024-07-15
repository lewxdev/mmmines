"use client";

import useSocket from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { Field } from "./game";
import { socket } from "./socket";

const GRID_SIZE = 20;
const field = new Field();

const colorMap = new Map<number, string>([
  [0, "bg-gray-50"],
  [1, "bg-gray-100"],
  [2, "bg-gray-200"],
  [3, "bg-gray-300"],
  [4, "bg-gray-400"],
  [5, "bg-gray-500"],
  [6, "bg-gray-600"],
  [7, "bg-gray-700"],
  [8, "bg-gray-800"],
  [9, "bg-red-500"],
]);

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
      <div
        style={{
          display: "grid",
          gap: `${GRID_SIZE * 0.1}px`,
          gridTemplateColumns: `repeat(${field.width}, ${GRID_SIZE}px)`,
          gridTemplateRows: `repeat(${field.height}, ${GRID_SIZE}px)`,
        }}
      >
        {field["data"].map((n, index) => {
          const value = n % 10;
          const color = colorMap.get(value)!;
          return <div className={color} key={index} />;
        })}
      </div>
    </div>
  );
}

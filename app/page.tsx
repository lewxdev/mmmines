"use client";

import useSocket from "@/hooks/useSocket";
import clsx from "clsx";
import { useEffect, useState } from "react";
import type { State } from "../utils/game";
import { socket } from "./socket";

const GRID_SIZE = 2;
const colorMap = new Map<State, string>([
  [0, "text-transparent"],
  [1, "text-gray-300"],
  [2, "text-gray-400"],
  [3, "text-gray-500"],
  [4, "text-gray-600"],
  [5, "text-gray-700"],
  [6, "text-gray-800"],
  [7, "text-gray-900"],
  [8, "text-gray-950"],
  ["mine", "bg-red-500"],
  ["unknown", "bg-gray-100"],
  ["flagged", "bg-yellow-300"],
]);

function Cell({ index, state }: { index: number; state: State }) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center text-xl font-bold",
        colorMap.get(state),
      )}
      onClick={() => {
        socket.emit("expose", index);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        socket.emit("flag", index);
      }}
    >
      {typeof state === "number" && state}
    </div>
  );
}

export default function Page() {
  const [cells, setCells] = useState<State[] | null>(null);
  const { isConnected, transport } = useSocket();
  const size = cells ? Math.sqrt(cells.length) : 0;

  useEffect(() => {
    socket.on("update", setCells);
    return () => {
      socket.off("update", setCells);
    };
  }, []);

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <div
        className="grid select-none"
        style={{
          gap: `${GRID_SIZE * 0.1}em`,
          gridTemplateColumns: `repeat(${size}, ${GRID_SIZE}em)`,
          gridTemplateRows: `repeat(${size}, ${GRID_SIZE}em)`,
        }}
      >
        {cells?.map((state, index) => (
          <Cell index={index} key={index} state={state} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { HEADER_HEIGHT } from "@/components/header";
import { Plot } from "@/components/plot";
import { useSocket } from "@/hooks/use-socket";
import { useSocketEvent } from "@/hooks/use-socket-event";

const GRID_SIZE = 2;
const GAP_SIZE = GRID_SIZE * 0.125;

export function Field() {
  useSocket();
  const [plots] = useSocketEvent("update");
  const size = plots ? Math.sqrt(plots.length) : 0;

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--field-size",
      size ? `${size * GRID_SIZE + (size - 1) * GAP_SIZE}rem` : "100%",
    );
  }, [size]);

  return (
    <div
      className="grid max-w-full select-none overflow-auto bg-white"
      onContextMenu={(event) => event.preventDefault()}
      style={{
        gap: `${GAP_SIZE}rem`,
        gridTemplateColumns: `repeat(${size}, ${GRID_SIZE}rem)`,
        gridTemplateRows: `repeat(${size}, ${GRID_SIZE}rem)`,
        maxHeight: `calc(100dvh - ${HEADER_HEIGHT}px)`,
      }}
    >
      {plots?.map((state, index) => <Plot {...{ state, index }} key={index} />)}
    </div>
  );
}

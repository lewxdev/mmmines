"use client";

import { useEffect, useState } from "react";
import { Plot } from "@/components/plot";
import useSocket from "@/hooks/use-socket";
import { socket } from "@/socket";
import type { PlotState } from "@/utils/game";

const GRID_SIZE = 2;

export function Field() {
  useSocket();
  const [plots, setPlots] = useState<PlotState[] | null>(null);
  const size = plots ? Math.sqrt(plots.length) : 0;

  useEffect(() => {
    socket.on("update", setPlots);
    return () => {
      socket.off("update", setPlots);
    };
  }, []);

  return (
    <div
      className="grid select-none bg-white"
      style={{
        gap: `${GRID_SIZE * 0.125}rem`,
        gridTemplateColumns: `repeat(${size}, ${GRID_SIZE}rem)`,
        gridTemplateRows: `repeat(${size}, ${GRID_SIZE}rem)`,
      }}
    >
      {plots?.map((state, index) => <Plot {...{ state, index }} key={index} />)}
    </div>
  );
}

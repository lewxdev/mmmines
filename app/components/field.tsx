"use client";

import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
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

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: size,
    gap: GAP_SIZE * 16,
    getScrollElement: () => parentRef.current,
    estimateSize: () => GRID_SIZE * 16,
  });
  const columnVirtualizer = useVirtualizer({
    ...rowVirtualizer.options,
    horizontal: true,
  });

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--field-size",
      size ? `${size * GRID_SIZE + (size - 1) * GAP_SIZE}rem` : "100%",
    );
  }, [size]);

  return !plots ? (
    <div className="absolute bg-white h-full w-full left-0 right-0">
      <div className="h-full flex items-center justify-center">
        <div
          className="grid animate-pulse"
          style={{
            gap: `${GAP_SIZE}rem`,
            gridTemplateColumns: `repeat(3, ${GRID_SIZE}rem)`,
          }}
        >
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-100"
              style={{ height: `${GRID_SIZE}rem`, width: `${GRID_SIZE}rem` }}
            />
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div
      className="max-w-full select-none overflow-auto bg-white"
      onContextMenu={(event) => event.preventDefault()}
      ref={parentRef}
      style={{ maxHeight: `calc(100dvh - ${HEADER_HEIGHT}px)` }}
    >
      <div
        className="relative"
        style={{
          height: rowVirtualizer.getTotalSize(),
          width: columnVirtualizer.getTotalSize(),
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) =>
          columnVirtualizer.getVirtualItems().map((virtualColumn) => {
            const index = virtualRow.index * size + virtualColumn.index;
            return (
              <Plot
                index={index}
                state={plots[index]!}
                // todo: add room/mode to key
                key={`${plots.length}:${index}`}
                className="absolute top-0 left-0"
                style={{
                  width: virtualColumn.size,
                  height: virtualRow.size,
                  transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                }}
              />
            );
          }),
        )}
      </div>
    </div>
  );
}

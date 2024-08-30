"use client";

import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Fade } from "@/components/fade";
import { GameOverDialog } from "@/components/game-over-dialog";
import { Plot } from "@/components/plot";
import { TutorialDialog } from "@/components/tutorial-dialog";
import { useSocketEvent } from "@/hooks/use-socket-event";

const GRID_SIZE = 2;
const GAP_SIZE = GRID_SIZE * 0.125;
const PX_PER_REM = 16;

export function Field() {
  const [sessionState] = useSocketEvent("sessionState");
  const [isNewSession] = useSocketEvent("newSession");
  const [plots] = useSocketEvent("update");
  const size = plots ? Math.sqrt(plots.length) : 0;

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: size,
    gap: GAP_SIZE * PX_PER_REM,
    paddingEnd: PX_PER_REM,
    estimateSize: () => GRID_SIZE * PX_PER_REM,
    getScrollElement: () => parentRef.current,
  });
  const columnVirtualizer = useVirtualizer({
    count: size,
    gap: GAP_SIZE * PX_PER_REM,
    horizontal: true,
    paddingStart: PX_PER_REM,
    paddingEnd: PX_PER_REM,
    estimateSize: () => GRID_SIZE * PX_PER_REM,
    getScrollElement: () => parentRef.current,
  });

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--field-size",
      size ? `${size * GRID_SIZE + (size - 1) * GAP_SIZE + 2}rem` : "100%",
    );
  }, [size]);

  return !plots ? (
    <div className="absolute z-10 h-[100dvh] w-[100dvw] bg-white dark:bg-slate-950">
      <div className="flex h-full items-center justify-center">
        <div
          className="grid animate-pulse"
          style={{
            gap: `${GAP_SIZE}rem`,
            gridTemplateColumns: `repeat(3, ${GRID_SIZE}rem)`,
          }}
        >
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className="bg-slate-100 dark:bg-slate-600"
              style={{ height: `${GRID_SIZE}rem`, width: `${GRID_SIZE}rem` }}
            />
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div
      className="max-w-full flex-1 select-none overflow-auto"
      onContextMenu={(event) => event.preventDefault()}
      ref={parentRef}
    >
      <div
        className="relative"
        style={{
          height: rowVirtualizer.getTotalSize(),
          width: columnVirtualizer.getTotalSize(),
        }}
      >
        {rowVirtualizer.getVirtualItems().flatMap((virtualRow) =>
          columnVirtualizer.getVirtualItems().map((virtualColumn) => {
            const { index: y, size: height, start: top } = virtualRow;
            const { index: x, size: width, start: left } = virtualColumn;
            const index = y * size + x;
            return (
              // todo: add room/mode to key
              <Fade key={`${size}:${index}`}>
                <Plot
                  className="absolute"
                  index={index}
                  state={plots[index]!}
                  style={{ height, width, top, left }}
                />
              </Fade>
            );
          }),
        )}
      </div>
      {sessionState === "dead" && <GameOverDialog />}
      {isNewSession && <TutorialDialog />}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import type { PlotState } from "#app/utils/game.ts";

type Props = {
  plots: PlotState[];
  scrollRef: React.RefObject<HTMLDivElement>;
};

type Viewport = {
  clientHeight: number;
  clientWidth: number;
  scrollHeight: number;
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
};

type CanvasSize = {
  height: number;
  pixelRatio: number;
  width: number;
};

const EMPTY_VIEWPORT: Viewport = {
  clientHeight: 0,
  clientWidth: 0,
  scrollHeight: 0,
  scrollLeft: 0,
  scrollTop: 0,
  scrollWidth: 0,
};

const EMPTY_CANVAS_SIZE: CanvasSize = {
  height: 0,
  pixelRatio: 1,
  width: 0,
};

const palettes = {
  dark: {
    background: "#020617",
    flagged: "#fde047",
    mine: "#f87171",
    numbered: "#94a3b8",
    unknown: "#475569",
  },
  light: {
    background: "#ffffff",
    flagged: "#facc15",
    mine: "#ef4444",
    numbered: "#64748b",
    unknown: "#e2e8f0",
  },
};

export function Minimap({ plots, scrollRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState(EMPTY_CANVAS_SIZE);
  const [viewport, setViewport] = useState(EMPTY_VIEWPORT);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const size = Math.sqrt(plots.length);
  const isScrollable =
    viewport.scrollWidth > viewport.clientWidth + 1 ||
    viewport.scrollHeight > viewport.clientHeight + 1;

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let animationFrame: number | undefined;
    const updateViewport = () => {
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setViewport({
          clientHeight: scrollElement.clientHeight,
          clientWidth: scrollElement.clientWidth,
          scrollHeight: scrollElement.scrollHeight,
          scrollLeft: scrollElement.scrollLeft,
          scrollTop: scrollElement.scrollTop,
          scrollWidth: scrollElement.scrollWidth,
        });
      });
    };

    const resizeObserver = new ResizeObserver(updateViewport);
    resizeObserver.observe(scrollElement);
    if (scrollElement.firstElementChild instanceof HTMLElement) {
      resizeObserver.observe(scrollElement.firstElementChild);
    }
    scrollElement.addEventListener("scroll", updateViewport, {
      passive: true,
    });
    updateViewport();

    return () => {
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      scrollElement.removeEventListener("scroll", updateViewport);
    };
  }, [plots.length, scrollRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isScrollable) return;

    const updateCanvasSize = () => {
      const bounds = canvas.getBoundingClientRect();
      const nextSize = {
        height: bounds.height,
        pixelRatio: window.devicePixelRatio || 1,
        width: bounds.width,
      };
      setCanvasSize((currentSize) =>
        currentSize.height === nextSize.height &&
        currentSize.pixelRatio === nextSize.pixelRatio &&
        currentSize.width === nextSize.width
          ? currentSize
          : nextSize,
      );
    };

    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(canvas);
    window.addEventListener("resize", updateCanvasSize);
    updateCanvasSize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [isScrollable]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      !canvas ||
      !canvasSize.height ||
      !canvasSize.width ||
      !Number.isInteger(size)
    ) {
      return;
    }

    canvas.width = Math.round(canvasSize.width * canvasSize.pixelRatio);
    canvas.height = Math.round(canvasSize.height * canvasSize.pixelRatio);

    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(canvasSize.pixelRatio, canvasSize.pixelRatio);

    const palette = isDark ? palettes.dark : palettes.light;
    context.fillStyle = palette.background;
    context.fillRect(0, 0, canvasSize.width, canvasSize.height);

    const cellWidth = canvasSize.width / size;
    const cellHeight = canvasSize.height / size;
    const inset = Math.min(0.5, cellWidth * 0.08, cellHeight * 0.08);

    plots.forEach((state, index) => {
      if (state === 0) return;

      if (state === "unknown") context.fillStyle = palette.unknown;
      else if (state === "flagged") context.fillStyle = palette.flagged;
      else if (state === "mine") context.fillStyle = palette.mine;
      else context.fillStyle = palette.numbered;

      context.globalAlpha = typeof state === "number" ? 0.2 + state * 0.08 : 1;
      context.fillRect(
        (index % size) * cellWidth + inset,
        Math.floor(index / size) * cellHeight + inset,
        Math.max(0.5, cellWidth - inset * 2),
        Math.max(0.5, cellHeight - inset * 2),
      );
    });
    context.globalAlpha = 1;
  }, [canvasSize, isDark, isScrollable, plots, size]);

  const navigateToPointer = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const scrollElement = scrollRef.current;
      if (!canvas || !scrollElement) return;

      const bounds = canvas.getBoundingClientRect();
      const x = (clientX - bounds.left) / bounds.width;
      const y = (clientY - bounds.top) / bounds.height;
      scrollElement.scrollTo({
        left: x * scrollElement.scrollWidth - scrollElement.clientWidth / 2,
        top: y * scrollElement.scrollHeight - scrollElement.clientHeight / 2,
      });
    },
    [scrollRef],
  );

  if (!isScrollable) return null;

  const viewportStyle = {
    height: `${(viewport.clientHeight / viewport.scrollHeight) * 100}%`,
    left: `${(viewport.scrollLeft / viewport.scrollWidth) * 100}%`,
    top: `${(viewport.scrollTop / viewport.scrollHeight) * 100}%`,
    width: `${(viewport.clientWidth / viewport.scrollWidth) * 100}%`,
  };

  return (
    <button
      aria-label="Minefield minimap. Drag to navigate or use the arrow keys to pan."
      className="absolute bottom-3 right-3 z-20 h-[clamp(6rem,18vw,9rem)] w-[clamp(6rem,18vw,9rem)] touch-none border border-slate-950/10 bg-white/90 p-1.5 shadow-sm backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-slate-950/90 dark:focus-visible:ring-slate-100 dark:focus-visible:ring-offset-slate-950 sm:bottom-4 sm:right-4"
      onKeyDown={(event) => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        const distanceX = scrollElement.clientWidth * 0.75;
        const distanceY = scrollElement.clientHeight * 0.75;
        const offsets = {
          ArrowDown: [0, distanceY],
          ArrowLeft: [-distanceX, 0],
          ArrowRight: [distanceX, 0],
          ArrowUp: [0, -distanceY],
        } as const;
        const offset = offsets[event.key as keyof typeof offsets];
        if (!offset) return;
        event.preventDefault();
        scrollElement.scrollBy({
          behavior: "smooth",
          left: offset[0],
          top: offset[1],
        });
      }}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        navigateToPointer(event.clientX, event.clientY);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          navigateToPointer(event.clientX, event.clientY);
        }
      }}
      type="button"
    >
      <span className="relative block h-full w-full">
        <canvas
          className="absolute inset-0 block h-full w-full"
          ref={canvasRef}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute box-border border-[1.5px] border-slate-900 bg-slate-900/5 dark:border-slate-50 dark:bg-slate-50/10"
          style={viewportStyle}
        />
      </span>
    </button>
  );
}

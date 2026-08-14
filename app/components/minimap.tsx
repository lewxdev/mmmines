"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PlotState } from "@/utils/game";

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

const EMPTY_VIEWPORT: Viewport = {
  clientHeight: 0,
  clientWidth: 0,
  scrollHeight: 0,
  scrollLeft: 0,
  scrollTop: 0,
  scrollWidth: 0,
};

const palettes = {
  dark: {
    background: "#020617",
    flagged: "#fde047",
    mine: "#f87171",
    numbered: "#94a3b8",
    unknown: "#475569",
    viewport: "#f8fafc",
    viewportFill: "rgba(248, 250, 252, 0.08)",
  },
  light: {
    background: "#ffffff",
    flagged: "#facc15",
    mine: "#ef4444",
    numbered: "#64748b",
    unknown: "#e2e8f0",
    viewport: "#0f172a",
    viewportFill: "rgba(15, 23, 42, 0.06)",
  },
};

export function Minimap({ plots, scrollRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewport, setViewport] = useState(EMPTY_VIEWPORT);
  const [isDark, setIsDark] = useState(false);
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
    const root = document.documentElement;
    const updateTheme = () => setIsDark(root.classList.contains("dark"));
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributeFilter: ["class"], attributes: true });
    updateTheme();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isScrollable || !Number.isInteger(size)) return;

    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.round(bounds.width * pixelRatio);
    canvas.height = Math.round(bounds.height * pixelRatio);

    const context = canvas.getContext("2d");
    if (!context) return;
    context.scale(pixelRatio, pixelRatio);

    const palette = isDark ? palettes.dark : palettes.light;
    context.fillStyle = palette.background;
    context.fillRect(0, 0, bounds.width, bounds.height);

    const cellWidth = bounds.width / size;
    const cellHeight = bounds.height / size;
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

    const viewportX =
      (viewport.scrollLeft / viewport.scrollWidth) * bounds.width;
    const viewportY =
      (viewport.scrollTop / viewport.scrollHeight) * bounds.height;
    const viewportWidth =
      (viewport.clientWidth / viewport.scrollWidth) * bounds.width;
    const viewportHeight =
      (viewport.clientHeight / viewport.scrollHeight) * bounds.height;

    context.fillStyle = palette.viewportFill;
    context.fillRect(viewportX, viewportY, viewportWidth, viewportHeight);
    context.strokeStyle = palette.viewport;
    context.lineWidth = 1.5;
    context.strokeRect(
      viewportX + 0.75,
      viewportY + 0.75,
      Math.max(0, viewportWidth - 1.5),
      Math.max(0, viewportHeight - 1.5),
    );
  }, [isDark, isScrollable, plots, size, viewport]);

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
      <canvas className="block h-full w-full" ref={canvasRef} />
    </button>
  );
}

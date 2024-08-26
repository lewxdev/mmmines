"use client";

import { Percent, UsersIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSocketEvent } from "@/hooks/use-socket-event";

export function Header() {
  const [clientsCount] = useSocketEvent("clientsCount");
  const [exposedPercent] = useSocketEvent("exposedPercent");

  return (
    <header className="w-[min(var(--field-size),100%)] px-4 py-1 flex justify-between">
      <div className="flex flex-row gap-6">
        <h1 className="text-4xl font-extrabold uppercase italic pr-4">
          mmmines
        </h1>
        <div className="flex items-center gap-2">
          <span>{clientsCount ?? "⋯"}</span>
          <UsersIcon className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2">
          <span>{exposedPercent ?? "⋯"}</span>
          <Percent className="h-4 w-4" />
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}

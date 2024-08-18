"use client";

import { Percent, UsersIcon } from "lucide-react";
import { useSocketEvent } from "@/hooks/use-socket-event";

export function Header() {
  const [clientsCount] = useSocketEvent("clientsCount");
  const [exposedPercent] = useSocketEvent("exposedPercent");

  return (
    <header className="w-[min(var(--field-size),100%)] bg-white px-4 flex justify-between">
      <h1 className="text-4xl font-extrabold uppercase italic">mmmines</h1>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <span>{clientsCount ?? "⋯"}</span>
          <UsersIcon className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2">
          <span>{exposedPercent ?? "⋯"}</span>
          <Percent className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}

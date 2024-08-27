"use client";

import { Percent, UsersIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSocketEvent } from "@/hooks/use-socket-event";
import { APP_NAME } from "@/utils/const";

export function Header() {
  const [clientsCount] = useSocketEvent("clientsCount");
  const [exposedPercent] = useSocketEvent("exposedPercent");

  return (
    <header className="flex w-[min(var(--field-size),100%)] justify-between px-4 py-1">
      <div className="flex flex-row gap-6">
        <h1 className="pr-4 text-4xl font-extrabold uppercase italic">
          {APP_NAME}
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

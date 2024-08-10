"use client";

import { Percent, UsersIcon } from "lucide-react";
import { useSocketEvent } from "@/hooks/use-socket-event";

export const HEADER_HEIGHT = 64;

export function Header() {
  const [clientsCount] = useSocketEvent("clientsCount");
  const [exposedPercent] = useSocketEvent("exposedPercent");

  return (
    <header
      className="w-[min(var(--field-size),100%)] bg-white"
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="flex justify-between">
        <h1 className="text-4xl">mmmines</h1>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {!!clientsCount && (
              <>
                <span>{clientsCount}</span>
                <UsersIcon className="h-4 w-4" />
              </>
            )}
          </div>
          <div className="flex items-center justify-end gap-2">
            {!!exposedPercent && (
              <>
                <span className="">{exposedPercent}</span>
                <Percent className="h-4 w-4" />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

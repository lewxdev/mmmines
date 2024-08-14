"use client";

import { useState } from "react";
import { Percent, UsersIcon } from "lucide-react";
import { useSocketEvent } from "@/hooks/use-socket-event";
import { socket } from "@/socket";

export const HEADER_HEIGHT = 64;

export function Header() {
  const [username, setUsername] = useState("");
  const [clientsCount] = useSocketEvent("clientsCount");
  const [exposedPercent] = useSocketEvent("exposedPercent");

  function handleCreate() {
    socket.auth = { username };
    socket.connect();
  }

  return (
    <header
      className="w-[min(var(--field-size),100%)] bg-white"
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="flex justify-between">
        <div>
          <h1 className="text-4xl">mmmines</h1>
          <div>
            <input
              placeholder="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <button type="submit" onClick={handleCreate}>
              join
            </button>
          </div>
        </div>
        <div className="flex flex-col items-between gap-2">
          {!!clientsCount && (
            <div className="flex items-center gap-2">
              <span>{clientsCount}</span>
              <UsersIcon className="h-4 w-4" />
            </div>
          )}
          {!!exposedPercent && (
            <div className="flex items-center justify-end gap-2">
              <span>{exposedPercent}</span>
              <Percent className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

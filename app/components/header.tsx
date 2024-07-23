"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { UsersIcon } from "lucide-react";
import { useEvent } from "@/hooks/use-event";

export const HEADER_HEIGHT = 64;

export function Header() {
  const [clientsCount] = useEvent("clientsCount");

  return (
    <header
      className="w-[min(var(--field-size),100%)] bg-white"
      style={{ height: HEADER_HEIGHT }}
    >
      <h1 className="text-4xl">mmmines</h1>
      <div className="flex justify-between">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <SignOutButton />
        </SignedIn>
        {!!clientsCount && (
          <div className="flex items-center justify-end gap-2">
            <UsersIcon className="h-4 w-4" />
            <span>{clientsCount}</span>
          </div>
        )}
      </div>
    </header>
  );
}

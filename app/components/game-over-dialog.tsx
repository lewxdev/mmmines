"use client";

import { useRef, useState } from "react";
import { CheckIcon, CopyIcon, Skull } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function GameOverDialog() {
  const [isOpen, setIsOpen] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shareLink = "https://mmmines.fly.dev/";

  const copyToClipboard = async () => {
    if (inputRef.current) {
      inputRef.current.select();
      await navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Game Over</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6">
          <Skull className="h-12 w-12 text-red-600 dark:text-red-300" />
          <div>
            <h1 className="pb-2 text-center text-lg font-semibold">
              You&apos;re out this round
            </h1>
            <h2 className="text-center text-sm text-slate-600 dark:text-slate-300">
              Share this link with others so you can get back in sooner!
            </h2>
          </div>
          <div className="flex w-full space-x-2">
            <Input
              ref={inputRef}
              readOnly
              value={shareLink}
              className="flex-grow"
            />
            <Button onClick={copyToClipboard} className="w-24">
              {isCopied ? (
                <>
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

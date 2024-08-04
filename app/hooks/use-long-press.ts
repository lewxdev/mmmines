import { useRef } from "react";

type Options = {
  onLongPress: () => void;
  onPress?: () => void;
  threshold?: number;
};

export function useLongPress({
  onLongPress,
  onPress,
  threshold = 400,
}: Options) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = (event: React.TouchEvent) => {
    event.preventDefault();
    timeoutRef.current = setTimeout(() => {
      onLongPress();
      timeoutRef.current = null;
    }, threshold);
  };

  const handleEnd = (callback?: () => void) => (event: React.TouchEvent) => {
    event.preventDefault();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      callback?.();
    }
  };

  return {
    onClick: onPress,
    onContextMenu: onLongPress,
    onTouchStart: handleStart,
    onTouchEnd: handleEnd(onPress),
    onTouchCancel: handleEnd(),
    onTouchMove: handleEnd(),
  } satisfies React.HTMLAttributes<HTMLElement>;
}

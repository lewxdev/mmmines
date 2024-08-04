import { useCallback, useRef } from "react";

type Options = {
  threshold?: number;
  onLongPress: () => void;
  onPress?: () => void;
};

export function useLongPress({
  threshold = 400,
  onLongPress,
  onPress,
}: Options) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleStart = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      onLongPress();
    }, threshold);
  }, [onLongPress, threshold]);

  const handleClear = useCallback(
    (shouldTrigger: boolean) => () => {
      const longPressTriggered = timeoutRef.current === null;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (!longPressTriggered && shouldTrigger && onPress) {
        onPress();
      }
    },
    [onPress],
  );

  const isTouchDevice =
    typeof window !== "undefined" && "ontouchstart" in window;

  return isTouchDevice
    ? {
        onTouchStart: handleStart,
        onTouchEnd: handleClear(true),
        onTouchMove: handleClear(false),
      }
    : {
        onClick: onPress,
        onContextMenu: (e: React.MouseEvent) => {
          e.preventDefault();
          onLongPress();
        },
      };
}

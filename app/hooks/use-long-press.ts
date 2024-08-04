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

  const handleStart = () => {
    timeoutRef.current = setTimeout(() => {
      onLongPress();
      navigator.vibrate?.(50);
      timeoutRef.current = null;
    }, threshold);
  };

  const handleEnd = (callback?: () => void) => (event: React.TouchEvent) => {
    if (event.cancelable) {
      // prevent click event if tapped
      event.preventDefault();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      callback?.();
    }
  };

  const handleRightClick = (event: React.MouseEvent) => {
    // prevent context menu
    event.preventDefault();
    // only trigger with secondary mouse button
    if (event.button === 2) {
      onLongPress();
    }
  };

  return {
    onClick: onPress,
    onContextMenu: handleRightClick,
    onTouchStart: handleStart,
    onTouchEnd: handleEnd(onPress),
    onTouchCancel: handleEnd(),
    onTouchMove: handleEnd(),
  } satisfies React.HTMLAttributes<HTMLElement>;
}

import { useCallback } from "react";
import clsx from "clsx/lite";
import { useSocket } from "@/components/socket-provider";
import { useLongPress } from "@/hooks/use-long-press";
import { tw } from "@/utils";
import type { PlotState } from "@/utils/game";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  index: number;
  state: PlotState;
};

export function Plot({ className, index, state, ...props }: Props) {
  const socket = useSocket();
  const longPressProps = useLongPress({
    onLongPress: useCallback(() => {
      if (state === "flagged" || state === "unknown") {
        socket.emit("flag", index);
      }
    }, [index, state, socket]),
    onPress: useCallback(() => {
      if (state === "unknown") {
        socket.emit("expose", index);
      }
    }, [index, state, socket]),
  });

  return (
    <div
      className={clsx(
        "flex items-center justify-center text-xl font-bold",
        classMap.get(state),
        className,
      )}
      {...longPressProps}
      {...props}
    >
      {textMap.has(state) ? textMap.get(state) : state}
    </div>
  );
}

const classMap = new Map<PlotState, string>([
  [1, tw`text-slate-300 dark:text-slate-700`],
  [2, tw`text-slate-400 dark:text-slate-600`],
  [3, tw`text-slate-500 dark:text-slate-500`],
  [4, tw`text-slate-600 dark:text-slate-400`],
  [5, tw`text-slate-700 dark:text-slate-300`],
  [6, tw`text-slate-800 dark:text-slate-200`],
  [7, tw`text-slate-900 dark:text-slate-100`],
  [8, tw`text-slate-950 dark:text-slate-50`],
  ["mine", tw`bg-red-500 dark:bg-red-400 text-slate-800 dark:text-slate-950`],
  [
    "flagged",
    tw`bg-slate-100 dark:bg-slate-600 text-yellow-400 dark:text-yellow-300`,
  ],
  ["unknown", tw`bg-slate-100 dark:bg-slate-600`],
]);

const textMap = new Map<PlotState, string | null>([
  ["mine", "\u25cf"],
  ["flagged", "\u25b2"],
  ["unknown", null],
  [0, null],
]);

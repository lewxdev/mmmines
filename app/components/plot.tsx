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
  const { socket } = useSocket();
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
  [1, tw`text-gray-300`],
  [2, tw`text-gray-400`],
  [3, tw`text-gray-500`],
  [4, tw`text-gray-600`],
  [5, tw`text-gray-700`],
  [6, tw`text-gray-800`],
  [7, tw`text-gray-900`],
  [8, tw`text-gray-950`],
  ["mine", tw`bg-red-500 text-gray-800`],
  ["flagged", tw`bg-gray-100 text-yellow-400`],
  ["unknown", tw`bg-gray-100`],
]);

const textMap = new Map<PlotState, string | null>([
  ["mine", "\u25cf"],
  ["flagged", "\u25b2"],
  ["unknown", null],
  [0, null],
]);

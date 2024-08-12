import { useEffect, useState } from "react";
import clsx from "clsx/lite";

export function Fade({ children }: React.PropsWithChildren) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={clsx(
        "transition-opacity duration-500 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      {children}
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  BombIcon,
  FlagIcon,
  GridIcon,
  MousePointerClick,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog";

const steps = [
  {
    title: "Massive Multiplayer Minesweeper",
    description:
      "Work together in real time to clear the grid and avoid the mines!",
    icon: <UsersIcon className="w-12 h-12 mb-4 text-primary" />,
  },
  {
    title: "Understand the Grid",
    description:
      "Minesweeper is played on a grid of squares. Some squares contain mines, while others are safe.",
    icon: <GridIcon className="w-12 h-12 mb-4 text-primary" />,
  },
  {
    title: "Left-Click to Reveal",
    description:
      "Left-click on a square to reveal what's underneath. If it's a mine, you lose! If it's safe, you'll see a number indicating how many mines are in the adjacent squares.",
    icon: <MousePointerClick className="w-12 h-12 mb-4 text-primary" />,
  },
  {
    title: "Right-Click to Flag",
    description:
      "If you suspect a square contains a mine, right-click to place a flag on it. This helps you keep track of potential mine locations.",
    icon: <FlagIcon className="w-12 h-12 mb-4 text-primary" />,
  },
  {
    title: "Win the Game",
    description:
      "To win, reveal all safe squares without clicking on any mines. Use the numbers as clues to deduce where the mines are located.",
    icon: <BombIcon className="w-12 h-12 mb-4 text-primary" />,
  },
];

export function TutorialDialog() {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(true);
  const totalSteps = steps.length;

  useEffect(() => {
    if (!open) {
      setStep(1);
    }
  }, [open]);

  const currentStep = steps[step - 1];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} defaultOpen>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>How to Play Minesweeper</DialogTitle>
          <DialogDescription>
            Learn the basics of Minesweeper in just a few steps!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center text-center py-4">
          {currentStep?.icon}
          <h3 className="text-lg font-semibold mb-2">{currentStep?.title}</h3>
          <p className="text-sm text-muted-foreground">
            {currentStep?.description}
          </p>
        </div>
        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </div>
          <div className="space-x-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            <Button onClick={handleNext}>
              {step < totalSteps ? "Next" : "Start Playing"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import {
  BombIcon,
  FlagIcon,
  GridIcon,
  MousePointerClick,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const steps = [
  {
    title: "Massive Multiplayer Mines",
    description:
      "Work together in real time to clear the grid and avoid the mines!",
    icon: <UsersIcon className="mb-4 h-12 w-12" />,
  },
  {
    title: "Understand the Grid",
    description:
      "Minesweeper is played on a grid of squares. Some squares contain mines, while others are safe.",
    icon: <GridIcon className="mb-4 h-12 w-12" />,
  },
  {
    title: "Left-Click to Reveal",
    description:
      "Left-click on a square to reveal what's underneath. If it's a mine, you lose!",
    icon: <MousePointerClick className="mb-4 h-12 w-12" />,
  },
  {
    title: "Right-Click to Flag",
    description:
      "Right-click to place a flag on a square to keep track of potential mine locations.",
    icon: <FlagIcon className="mb-4 h-12 w-12" />,
  },
  {
    title: "Hardcore",
    description:
      "Click a mine, and you're out until all squares are revealed and a new game starts with an even larger grid.",
    icon: <BombIcon className="mb-4 h-12 w-12" />,
  },
];

export function TutorialDialog() {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(true);
  const totalSteps = steps.length;
  const currentStep = steps[step - 1]!;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} defaultOpen>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>How to Play</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-4 text-center">
          {currentStep.icon}
          <h3 className="mb-2 text-lg font-semibold">{currentStep.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {currentStep.description}
          </p>
        </div>
        <DialogFooter>
          <div className="text-center text-sm text-slate-600 dark:text-slate-300">
            Step {step} of {totalSteps}
          </div>
          <div className="flex space-x-2">
            <Button
              className="flex-1"
              variant="outline"
              onClick={
                step === 1 ? () => setOpen(false) : () => setStep(step - 1)
              }
            >
              {step === 1 ? "Skip" : "Back"}
            </Button>
            <Button className="flex-1" onClick={handleNext}>
              {step < totalSteps ? "Next" : "Start Playing"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

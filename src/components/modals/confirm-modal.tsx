import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { BadgeInfoIcon } from "lucide-react";

interface ConfirmModalProps {
  title: string;
  subTitle: string;
  openModal: boolean;
  className?: string;
  setOpenModal: (openModal: boolean) => void;
  children?: React.ReactNode;
  action?: () => void;
  closeAction?: () => void;
  showCloseIcon?: boolean;
  isLoading?: boolean;
  iconClasses?: string[];
  closeButtonText?: string;
  actionButtonText?: string;
  disableActionButton?: boolean;
  actionButtonVariant?:
    | "destructive"
    | "link"
    | "default"
    | "outline"
    | "secondary"
    | null
    | undefined;
}

export const ConfirmModal = ({
  title,
  subTitle,
  openModal,
  setOpenModal,
  className,
  children,
  action,
  closeAction,
  isLoading = false,
  iconClasses = ["bg-red-100", "fill-red-500", "bg-red-500"],
  closeButtonText = "Cancel",
  actionButtonText = "Delete",
  actionButtonVariant = "destructive",
  disableActionButton,
}: ConfirmModalProps) => {
  return (
    <Dialog open={openModal} onOpenChange={() => setOpenModal(false)}>
      <DialogContent className={cn("px-0 sm:max-w-md", className)}>
        <div className="flex items-start justify-start text-left">
          <div className="px-4">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                iconClasses[0]
              )}
            >
              <BadgeInfoIcon
                className={iconClasses[1]}
                width="24"
                height="24"
              />
            </div>
          </div>
          <div>
            <DialogHeader className="pr-3 text-left">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="text-base">
                {subTitle}
              </DialogDescription>
            </DialogHeader>
            {children}
          </div>
        </div>
        <DialogFooter className="gap-3 px-4 sm:gap-0">
          <Button
            variant="outline"
            className="shadow-none"
            onClick={() => (closeAction ? closeAction() : setOpenModal(false))}
          >
            {closeButtonText}
          </Button>
          <Button
            disabled={isLoading || disableActionButton}
            variant={actionButtonVariant}
            onClick={action && action}
          >
            <span className="flex items-center">{actionButtonText}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

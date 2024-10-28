import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface FormModalProps {
  title: string;
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  children: React.ReactNode;
}

export const FormModal = ({
  title,
  openModal,
  setOpenModal,
  children,
}: FormModalProps) => {
  return (
    <Dialog open={openModal} onOpenChange={() => setOpenModal(false)}>
      <DialogContent className="px-0 sm:max-w-lg" aria-labelledby="">
        <DialogHeader className="space-y-0 px-4 text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

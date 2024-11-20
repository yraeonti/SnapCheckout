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
      <DialogContent
        className="px-0 overflow-auto overflow-y-scroll max-h-[80vh] sm:max-w-xl"
        aria-labelledby=""
      >
        <DialogHeader className="space-y-0 px-4 text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

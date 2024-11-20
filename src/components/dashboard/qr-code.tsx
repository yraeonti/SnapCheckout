import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode } from "lucide-react";

export default function QrCodeLink({ link }: { link: string }) {
  return (
    <Dialog>
      <DialogTrigger>
        <QrCode className="size-5" />
      </DialogTrigger>

      <DialogContent className="max-w-fit">
        <DialogHeader className="space-y-0 px-4 text-left ">
          <DialogTitle>Scan Qr Code</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-center bg-white">
          <QRCodeSVG
            value={link}
            size={280}
            level={"Q"}
            marginSize={2}
            imageSettings={{
              src: "/logo-dark.svg",
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

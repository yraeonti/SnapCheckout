import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const TruncatedTextCell = ({ text }: { text?: string }) => {
  const url = `${window.location.origin}/checkout/${text}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url || "");
    toast.success(`${url} copied to clipboard`);
  };

  return (
    <div className="flex items-center w-fit gap-2 group">
      <div className="truncate w-[30%]">
        <span>{url}</span>
      </div>
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={copyToClipboard}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
        aria-label="Copy to clipboard"
      >
        <Copy className="w-4 h-4 text-gray-500" />
      </Button>
    </div>
  );
};

export default TruncatedTextCell;

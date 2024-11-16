import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader, Loader2 } from "lucide-react";
import RenderSignUp from "@/components/sign-up";

export default function Page() {
  return (
    <div className="flex items-center justify-center">
      <ClerkLoaded>
        <RenderSignUp />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="animate-spin text-muted-foreground" />
      </ClerkLoading>
    </div>
  );
}

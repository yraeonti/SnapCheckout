import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { Loader, Loader2 } from "lucide-react";

export default function Page() {
  return (
    <div className="flex items-center justify-center">
      <ClerkLoaded>
        <SignUp />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="animate-spin text-muted-foreground" />
      </ClerkLoading>
    </div>
  );
}

"use client";
import { SignUp, useSignUp } from "@clerk/nextjs";
import { useEffect } from "react";

export default function RenderSignUp() {
  const { signUp } = useSignUp();

  useEffect(() => {
    (async () => {
      if (signUp) {
        const { status, emailAddress, createdUserId } = signUp;
        if (status) {
          if (status === "complete") {
            console.log("signs");

            await fetch("api/profile/client_link", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: emailAddress,
                userId: createdUserId,
              }),
            });
          }
        }
      }
    })();
  }, [signUp?.status]);
  return <SignUp />;
}

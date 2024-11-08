"use client";

import { SendHorizonal } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useState, useRef } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { GeminiResponse } from "./insights-board";
import { cn } from "@/lib/utils";

export default function SendPrompt() {
  const [expandArea, setExpandArea] = useState(false);

  const [prompt, setPrompt] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await axios.post("/api/gemini", { text });
      return res.data;
    },
    onSuccess: (data: { status: boolean; data: GeminiResponse[] }) => {
      queryClient.setQueryData(["/api/gemini"], (olddata: GeminiResponse[]) => {
        const newData = data.data;
        return [...olddata, newData];
      });
    },
  });

  const disabled = !prompt || mutation.isPending;

  return (
    <>
      <div
        className="sticky overflow-hidden px-2 mt-auto bg-white bottom-10 shadow-sm
                      w-11/12 flex items-center mx-auto border border-black/30
                      rounded-e-full rounded-s-full"
      >
        <Textarea
          className="border-none focus-visible:ring-0 text-wrap w-full h-full min-h-10 resize-none"
          ref={textAreaRef}
          placeholder={
            mutation.isPending ? "Query is running..." : "Query your data..."
          }
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (e.target.textLength > 120) {
              setExpandArea(true);
            }
          }}
          rows={expandArea ? 3 : 1}
        />

        <button
          className={cn(
            "rounded-full p-1 bg-sky-500",
            disabled && "opacity-40 cursor-not-allowed"
          )}
          onClick={() => {
            if (!prompt) {
              return;
            }
            mutation.mutate(prompt);

            setPrompt("");
          }}
          disabled={disabled}
        >
          <SendHorizonal className="stroke-white size-6 mx-auto" />
        </button>
      </div>
    </>
  );
}

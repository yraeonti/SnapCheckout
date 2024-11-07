"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getData } from "@/services/service";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useRef } from "react";
import SendPrompt from "./send-prompt";

type Resp = {
  text: string;
  bullet_points?: {
    header: string;
    points: string[];
  };
  table?: {
    columns: string[];
    rows: any[][];
  };
  image?: string;
};

export interface GeminiResponse {
  prompt: string;
  resp: Resp[];
}

export default function InsightsBoard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["/api/gemini"],
    queryFn: getData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const contentRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [data]);

  const prompt_ui = (data: GeminiResponse[]) => (
    <section className="flex flex-col gap-7 w-[95%]">
      {data.map((dat, i) => {
        return (
          <div className="space-y-3" key={i}>
            {dat.prompt && (
              <div
                className="bg-black/70 text-white p-2 whitespace-normal shadow-lg 
                            font-medium text-base rounded-e-2xl 
                            rounded-s-2xl border border-neutral-200 lg:max-w-[75%] max-w-[85%] 
                            min-w-56 w-fit"
              >
                <p>Prompt: {dat.prompt}</p>
              </div>
            )}

            <div
              className="bg-black/80 text-white px-2 py-9 whitespace-normal
                              shadow-lg font-medium text-base rounded-e-xl rounded-s-xl
                              lg:max-w-[91%] max-w-[97%] border border-neutral-200 space-y-10"
            >
              {dat.resp.map((da, i) => {
                return (
                  <div className="flex flex-col gap-3" key={i}>
                    {da.text && <p className="px-5">{da.text}</p>}
                    {da?.bullet_points && (
                      <>
                        {da.bullet_points.header && (
                          <h1 className="pl-3 font-semibold text-lg">
                            {da.bullet_points.header}
                          </h1>
                        )}

                        {da.bullet_points.points &&
                          da.bullet_points.points.map((d, i) => (
                            <ul className="list-disc pl-10" key={i}>
                              <li>{d}</li>
                            </ul>
                          ))}
                      </>
                    )}
                    {da?.table && da.table?.columns.length > 0 && (
                      <div className="px-5">
                        <Table className="whitespace-nowrap overflow-scroll">
                          <TableCaption>Table</TableCaption>
                          <TableHeader>
                            <TableRow className="text-white">
                              {da.table.columns.map((d, i) => {
                                return (
                                  <TableHead
                                    className="w-[100px] text-white/70"
                                    key={i}
                                  >
                                    {d}
                                  </TableHead>
                                );
                              })}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {da.table.rows.map((d, i) => (
                              <TableRow key={i}>
                                {d.map((e, i) => (
                                  <TableCell className="font-medium" key={i}>
                                    {e}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );

  return (
    <>
      <Tabs defaultValue="account" className="w-full mb-10">
        <TabsList className="space-x-5 bg-transparent">
          <TabsTrigger
            className="data-[state=active]:bg-zinc-300 data-[state=active]:text-black px-7 text-lg"
            value="account"
          >
            Insights
          </TabsTrigger>
        </TabsList>
        <TabsContent ref={contentRef} className="pt-8" value="account">
          {isLoading && !data ? (
            <div className="flex flex-col gap-7 w-[95%]">
              <Skeleton className="bg-neutral-400  w-[40%] h-16 rounded-e-2xl rounded-s-2xl" />

              <Skeleton className="bg-neutral-500 w-[80%] h-60 rounded-e-xl rounded-s-xl" />
            </div>
          ) : Array.isArray(data) && data.length > 0 ? (
            prompt_ui(data)
          ) : (
            <div>Error</div>
          )}
        </TabsContent>
      </Tabs>

      <SendPrompt />
    </>
  );
}

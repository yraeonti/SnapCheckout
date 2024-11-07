import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InsightsBoard from "@/components/insights-board";

export default function Insights() {
  return (
    <main className="px-4 pt-4 pb-11 flex flex-col min-h-full">
      <InsightsBoard />
    </main>
  );
}

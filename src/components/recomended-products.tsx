"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/services/service";
import { StoreItem } from "./dashboard/store/store-item";

export default function RecommendedProducts({ slug }: { slug: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/checkout/${slug}/recommend`],
    queryFn: getData,
  });

  return (
    <>
      <h4 className="text-xl font-medium my-4">Recommended Products</h4>
      <Carousel className="w-full">
        {/* <CarouselContent className="">
            {
               Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/5"
                >
                  <Skeleton className="h-64 " />
                </CarouselItem>
              ))
            }
         </CarouselContent> */}

        {isLoading || !data ? (
          <CarouselContent className="">
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="basis-1/2 md:basis-1/3 lg:basis-1/5"
              >
                <Skeleton className="h-64 " />
              </CarouselItem>
            ))}
          </CarouselContent>
        ) : error || data.length == 0 ? (
          <div className="">No recommendations</div>
        ) : (
          <CarouselContent className="">
            {data.map((dat: any, i: number) => (
              <CarouselItem
                className="basis-1/2 md:basis-1/3 lg:basis-1/5"
                key={i}
              >
                <StoreItem item={dat} recommend />
              </CarouselItem>
            ))}
          </CarouselContent>
        )}

        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>
    </>
  );
}

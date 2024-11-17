import React from "react";
import { Facebook, Instagram, Store, Twitter } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IProfileSettings } from "@/types/profile.dto";

interface MerchantProfileCardProps {
  profile?: IProfileSettings;
}
export const MerchantProfileCard = ({ profile }: MerchantProfileCardProps) => {
  const data = (profile && profile) || {};
  return (
    <Card className="mx-auto max-w-md w-full shadow-none">
      <CardHeader className="flex flex-col items-center space-y-2 pb-3">
        <h2 className="text-xl font-bold flex text-[#f4b05d]">
          <Store className="" />
          {data?.brand_details?.brand_name || ""}
        </h2>
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          <img
            src={data?.brand_details?.brand_logo || "/logo.png"}
            alt={data?.brand_details?.brand_name || ""}
            className="object-cover w-full h-full"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center space-x-6">
          <a
            href={data?.social_links?.instagram ?? ""}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-700 transition-colors"
          >
            <Instagram size={24} />
          </a>
          <a
            href={data?.social_links?.twitter || ""}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-500 transition-colors"
          >
            <Twitter size={24} />
          </a>
          <a
            href={data?.social_links?.facebook || ""}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Facebook size={24} />
          </a>
        </div>
      </CardContent>

      <CardFooter className="text-sm italic text-center justify-center text-muted-foreground">
        Fill details below to proceed to checkout items
      </CardFooter>
    </Card>
  );
};

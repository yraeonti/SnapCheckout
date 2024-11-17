import { FormModal } from "@/components/modals/form-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ISocialLinks } from "@/types/profile.dto";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { useState } from "react";
import Socials from "../complete-profile/socials";

interface SocialLinksProps {
  socialLinks?: ISocialLinks | null;
}

export const SocialLinks = ({ socialLinks }: SocialLinksProps) => {
  const [openEdit, setOpenEdit] = useState(false);
  const socialPlatforms = [
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5 text-pink-600" />,
      link: socialLinks?.instagram,
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5 text-blue-400" />,
      link: socialLinks?.twitter,
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5 text-blue-600" />,
      link: socialLinks?.facebook,
    },
  ];

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Social Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {socialPlatforms.map((platform) => (
            <div key={platform.name} className="flex items-center gap-2">
              {platform.icon}
              <Label>{platform.name}</Label>
              <a
                href={platform.link || "#"}
                className="text-blue-600 hover:underline"
              >
                {platform.link || "Not set"}
              </a>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={() => setOpenEdit(true)}>Edit Details</Button>
      </CardFooter>

      <FormModal
        title="Edit Social Links"
        openModal={openEdit}
        setOpenModal={() => setOpenEdit(false)}
      >
        <Socials
          socialLinks={socialLinks ?? {}}
          closeModal={() => setOpenEdit(false)}
        />
      </FormModal>
    </div>
  );
};

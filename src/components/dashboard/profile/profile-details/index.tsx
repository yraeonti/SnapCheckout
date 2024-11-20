"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

import { AnimatePresence, motion } from "motion/react";
import { AccountOptions } from "../complete-profile/profile-options";
import { IProfileSettings } from "@/types/profile.dto";
import { AccountInformation } from "./bank-information";
import { BrandDetails } from "./brand";
import { SocialLinks } from "./socials";
import { BusinessVerification } from "./verification";

interface ProfileDetailsProps {
  initialData: IProfileSettings;
}
export const ProfileDetails = ({ initialData }: ProfileDetailsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const options = ["Brand", "Socials", "Bank", "Verification"];

  const settingsOptions = [
    {
      type: "brand",
      component: (
        <BrandDetails
          brandDetails={initialData.brand_details}
          clientLink={initialData.client_link}
        />
      ),
    },
    {
      type: "socials",
      component: <SocialLinks socialLinks={initialData.social_links} />,
    },
    {
      type: "bank",
      component: (
        <AccountInformation accountDetails={initialData?.account_details} />
      ),
    },
    {
      type: "verification",
      component: <BusinessVerification />,
    },
  ];

  let page = searchParams.get("brand");
  const pageValid =
    page && settingsOptions.find((sop) => sop.type === page?.toLowerCase());
  page = pageValid ? page : options[0];

  const [settingsOption, setSettingsOption] = useState(page);
  const [mobileOptionsTile, setMobileOptionsTile] = useState(!pageValid);

  const handleChangeOptions = (option: string) => {
    setSettingsOption(option);
    const newUrl = `${window.location.pathname}/?tab=${option.toLowerCase()}`;
    router.push(newUrl);
  };

  const handleMobileOptionsTile = (option: string) => {
    handleChangeOptions(option);
    setMobileOptionsTile(false);
  };

  const handleResetURL = () => {
    router.push(window.location.pathname);
  };

  return (
    <main className="p-2 space-y-5 w-full">
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-7 relative rounded-lg py-10 px-4 md:px-10">
        <motion.aside
          className={cn(
            "xl:-mt-10 absolute xl:static w-full",
            !mobileOptionsTile ? "-left-[115%]" : "inset-x-0"
          )}
          transition={{ ease: "easeInOut", duration: 0.4 }}
          layout="position"
        >
          <div className="space-y-5">
            <h1 className="text-xl font-semibold">Profile Details</h1>
          </div>
          <AccountOptions
            settingsOption={settingsOption}
            options={options}
            handleChangeOptions={handleChangeOptions}
            handleMobileOptionsTile={handleMobileOptionsTile}
          />
        </motion.aside>

        <motion.aside
          transition={{ ease: "easeInOut", duration: 0.4 }}
          layout
          className={cn(
            "border rounded-xl overflow-hidden absolute xl:static w-full p-3",
            !mobileOptionsTile ? "inset-x-0" : "-right-[115%] "
          )}
        >
          <ChevronLeft
            className="my-3 ml-3 xl:hidden cursor-pointer"
            onClick={() => {
              setMobileOptionsTile(true);
              handleResetURL();
            }}
          />
          {settingsOptions.map((sop, i) => {
            const current = settingsOption?.toLowerCase() === sop.type;
            return (
              <div key={i}>
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ ease: "easeInOut", duration: 0.3 }}
                    key={settingsOption}
                  >
                    {current && sop.component}
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })}
        </motion.aside>
      </section>
    </main>
  );
};

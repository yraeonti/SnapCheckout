import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

interface AccountOptionsProps {
  options: string[];
  settingsOption?: string | null;
  handleChangeOptions: (option: string) => void;
  handleMobileOptionsTile: (option: string) => void;
}

export const AccountOptions: React.FC<AccountOptionsProps> = ({
  options,
  settingsOption,
  handleChangeOptions,
  handleMobileOptionsTile,
}) => {
  const user = useUser();

  return (
    <aside className="flex flex-col items-center gap-y-4">
      <Avatar className="size-28">
        <AvatarImage src={user.user?.imageUrl} />
        <AvatarFallback className="text-black">VN</AvatarFallback>
      </Avatar>
      <p className="text-textPrimary">{user.user?.fullName}</p>

      <div className="w-full mt-6 font-medium hidden xl:block">
        {options.map((o, i) => (
          <Options
            key={i}
            handleChangeOptions={handleChangeOptions}
            type={o}
            color={i % 2 === 0 ? "" : ""}
            isActive={o === settingsOption}
          />
        ))}
      </div>
      <div className="w-full mt-6 font-medium xl:hidden">
        {options.map((o, i) => (
          <Options
            key={i}
            handleChangeOptions={handleMobileOptionsTile}
            type={o}
            color={i % 2 === 0 ? "" : ""}
            isActive={o === settingsOption}
          />
        ))}
      </div>
    </aside>
  );
};

interface OptionsProps {
  type: string;
  isActive: boolean;
  color?: string;
  handleChangeOptions: (option: string) => void;
}

const Options: React.FC<OptionsProps> = ({
  isActive,
  type,
  color,
  handleChangeOptions,
}) => {
  return (
    <motion.div
      key={type}
      className={cn(
        "flex justify-between items-center px-7 py-6 cursor-pointer rounded-lg",
        color,
        isActive && "bg-gray-100 text-textPrimary"
      )}
      onClick={() => handleChangeOptions(type)}
    >
      <span>{type}</span>
      <ChevronRight className="size-4" />
    </motion.div>
  );
};

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";

const SidebarItem = ({ item, pageName, setPageName }: any) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const pathname = usePathname();

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isActive) {
      setOpenDropdown(true);
    } else {
      setOpenDropdown(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (item.route == "/dashboard") {
      setIsActive(pathname === item.route);
    } else {
      setIsActive(pathname.startsWith(item.route));
    }
  }, [pathname]);

  const handleClick = () => {
    if (item.children) {
      setOpenDropdown(!openDropdown);
    }

    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    return setPageName(updatedPageName);
  };

  return (
    <>
      <li>
        <Link
          href={item.route}
          onClick={handleClick}
          className={`${
            isActive
              ? "bg-black text-white"
              : "text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white"
          } group relative flex items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out`}
        >
          {item.icon}
          {item.label}
          {item.message && (
            <span className="absolute right-11.5 top-1/2 -translate-y-1/2 rounded-full bg-red-light-6 px-1.5 py-px text-[10px] font-medium leading-[17px] text-red">
              {item.message}
            </span>
          )}
          {item.pro && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md bg-primary px-1.5 py-px text-[10px] font-medium leading-[17px] text-white">
              Pro
            </span>
          )}
        </Link>
      </li>
    </>
  );
};

export default SidebarItem;

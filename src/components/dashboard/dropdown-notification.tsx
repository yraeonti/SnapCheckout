import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import Image from "next/image";
import { BellIcon } from "lucide-react";
import ClickOutside from "../click-outside";

const notificationList = [
  {
    image: "/woman-vr.svg",
    title: "Piter Joined the Team!",
    subTitle: "Congratulate him",
  },
  {
    image: "/woman-vr.svg",
    title: "New message received",
    subTitle: "Devid sent you new message",
  },
  {
    image: "/woman-vr.svg",
    title: "New Payment received",
    subTitle: "Check your earnings",
  },
  {
    image: "/woman-vr.svg",
    title: "Jolly completed tasks",
    subTitle: "Assign her newtasks",
  },
  {
    image: "/woman-vr.svg",
    title: "Roman Joined the Team!",
    subTitle: "Congratulate him",
  },
];

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  return (
    <ClickOutside
      onClick={() => setDropdownOpen(false)}
      className="relative hidden sm:block"
    >
      <li>
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          href="#"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-stroke bg-gray-2 text-dark hover:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:hover:text-white"
        >
          <span className="relative">
            <BellIcon className="h-5 w-5 stroke-current duration-300 ease-in-out" />
            <span
              className={`absolute -top-0.5 right-0 z-1 h-2.5 w-2.5 rounded-full border-2 border-gray-2 bg-red-light dark:border-dark-3 ${
                !notifying ? "hidden" : "inline"
              }`}
            >
              <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-red-light opacity-75"></span>
            </span>
          </span>
        </Link>

        {dropdownOpen && (
          <div
            className={`absolute -right-27 mt-7.5 flex h-[550px] w-75 flex-col rounded-xl border-[0.5px] border-stroke bg-white px-5 pb-5 pt-5 shadow-default dark:border-dark-3 dark:bg-gray-dark sm:right-0 sm:w-[364px]`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h5 className="text-lg font-medium text-dark dark:text-white">
                Notifications
              </h5>
              <span className="rounded-md bg-primary px-2 py-0.5 text-body-xs font-medium text-white">
                5 new
              </span>
            </div>

            <ul className="no-scrollbar mb-5 flex h-auto flex-col gap-1 overflow-y-auto">
              {notificationList.map((item, index) => (
                <li key={index}>
                  <Link
                    className="flex items-center gap-4 rounded-[10px] p-2.5 hover:bg-gray-2 dark:hover:bg-dark-3"
                    href="#"
                  >
                    <span className="block h-14 w-14 rounded-full">
                      <Image
                        width={112}
                        height={112}
                        src={item.image}
                        style={{
                          width: "auto",
                          height: "auto",
                        }}
                        alt="User"
                      />
                    </span>

                    <span className="block">
                      <span className="block font-medium text-dark dark:text-white">
                        {item.title}
                      </span>
                      <span className="block text-body-sm font-medium text-dark-5 dark:text-dark-6">
                        {item.subTitle}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              className="flex items-center justify-center rounded-[7px] border border-primary p-2.5 font-medium text-primary hover:bg-blue-light-5 dark:border-dark-4 dark:text-dark-6 dark:hover:border-primary dark:hover:bg-blue-light-3 dark:hover:text-primary"
              href="#"
            >
              See all notifications
            </Link>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;

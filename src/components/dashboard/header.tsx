import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader2, Menu } from "lucide-react";
import DropdownNotification from "./dropdown-notification";
import SearchForm from "./search-form";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-30 flex w-full border-b border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-grow items-center justify-between px-4 py-3 shadow-2 md:px-5 2xl:px-10">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-50 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-dark-3 dark:bg-dark-2 lg:hidden"
          >
            <Menu />
          </button>
        </div>

        <div className="flex items-center justify-normal gap-2 2xsm:gap-4 lg:w-full lg:justify-between">
          <SearchForm />

          {/* <!-- User Area --> */}

          <div className="flex gap-4 items-center">
            {/* <DropdownNotification /> */}
            <div>
              <ClerkLoaded>
                <UserButton />
              </ClerkLoaded>
              <ClerkLoading>
                <Loader2 className="animate-spin text-muted-foreground" />
              </ClerkLoading>
            </div>
          </div>
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;

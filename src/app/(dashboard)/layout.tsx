import DashboardLayout from "@/components/dashboard/dashboard-layout";

type props = {
  children: React.ReactNode;
};

const DashboardRootLayout = ({ children }: props) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashboardRootLayout;

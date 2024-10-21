type props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: props) => {
  return (
    <>
      <main className="">{children}</main>
    </>
  );
};

export default DashboardLayout;

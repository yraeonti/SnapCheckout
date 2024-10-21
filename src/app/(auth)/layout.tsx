import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full">
      <div className="w-full max-w-[40%] items-center justify-center hidden md:flex h-screen bg-black">
        <Image
          src="/logo-light.svg"
          alt="Snap Checkout"
          width={300}
          height={300}
        />
      </div>
      <main className="flex justify-center items-center mx-auto h-screen">
        {children}
      </main>
    </div>
  );
}

import type React from "react";
import Navbar from "~/components/Navbar/Navbar";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className=" flex h-screen w-full flex-col items-center bg-[rgb(216,190,254)]  text-white lg:h-auto lg:min-h-screen">
      <Navbar />
      <div
        id="layout"
        className="coingrid-scrollbar relative z-50 h-screen w-full w-full flex-1 items-center overflow-x-hidden  overflow-y-scroll rounded-t-[40px] pb-2   pt-6 sm:p-8 md:rounded-[40px] md:p-10 lg:mb-6 lg:overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
}

export default DefaultLayout;

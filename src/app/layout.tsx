import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/navbar";
import SidebarMenu from "@/components/layout/sidebar-menu";
import BottomTabBar from "@/components/layout/bottom-tab-bar";

function ContentFallback() {
  return (
    <div
      aria-busy="true"
      className="min-h-[240px] w-full border border-stone-400 p-6 dark:border-stone-500"
    >
      <div className="h-4 w-1/3 bg-stone-200 dark:bg-neutral-700" />
      <div className="mt-4 h-3 w-2/3 bg-stone-200 dark:bg-neutral-700" />
    </div>
  );
}

export const Layout = () => {
  return (
    <div className="grid place-items-center dark:bg-neutral-800 dark:text-white">
      <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
        <Navbar />
        <main className="min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom))] lg:flex lg:gap-[32px] lg:pb-8 lg:pt-8">
          <SidebarMenu />
          <div className="lg:w-full">
            <Suspense fallback={<ContentFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      <BottomTabBar />
    </div>
  );
};

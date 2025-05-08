
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-2xl font-semibold">Monitor de Tinas de Mezcal</h1>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;

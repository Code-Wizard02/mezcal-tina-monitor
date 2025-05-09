
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { FlaskConical } from "lucide-react";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <SidebarTrigger className="mr-2" />
            <div className="flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-mezcal-amber" />
              <h1 className="text-2xl font-semibold">Monitor de Tinas de Mezcal</h1>
            </div>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;


import { NavLink } from "react-router-dom";
import { FileText, Home, Thermometer, Wifi } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", path: "/", icon: Home },
  { title: "Reportes", path: "/reports", icon: FileText },
  { title: "Sensores", path: "/sensor-setup", icon: Wifi },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4">
          <Thermometer className="h-6 w-6 text-mezcal-amber" />
          <span className="text-lg font-bold">Tina Monitor</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path} 
                      className={({ isActive }) => isActive ? "active-link" : ""}
                      end
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-4 py-3">
        <div className="text-sm text-muted-foreground">
          © 2025 Monitor de Tinas
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

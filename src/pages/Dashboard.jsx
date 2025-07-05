import { Outlet } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarTrigger } from "../Components/ui/sidebar";
import AppSidebar from "../Components/AppSidebar";
import { UserContext } from "../Context/UserContext"; // Adjust path as needed
import { CircularProgress } from "@mui/material";
import { useState } from "react";

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(true);

  return (
    <SidebarProvider className={"min-w-full"}>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <Sidebar collapsible="icon" defaultOpen={true}>
          <AppSidebar />
        </Sidebar>

        {/* Main Content */}
        <main className={`flex-1 p-6 bg-gray-50 min-h-screen overflow-auto`}>
          <SidebarTrigger className={"absolute"} />
          <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

          {loading ? (
            <p className="text-gray-500">
              <CircularProgress />
            </p>
          ) : user ? (
            <Outlet />
          ) : (
            <p className="text-red-500">Unauthorized. Redirecting...</p>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}

export default Dashboard;

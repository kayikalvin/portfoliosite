import { Outlet } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarTrigger } from "../components/ui/sidebar";
// import { CircularProgress } from "@mui/material";
import { useState } from "react";
import AppSidebar from "../components/AppSidebar";

function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(true);

  return (
    <SidebarProvider className={"min-w-full"}>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <Sidebar collapsible="icon" defaultOpen={true}>
          <AppSidebar />
        </Sidebar>

        {/* Main Content */}
        <main className={`flex-1 p-6 bg-gray-50 min-h-screen w-screen overflow-auto`}>
          <SidebarTrigger className={"absolute top-1"} />
          <h2 className="text-2xl font-semibold">Admin Dashboard</h2>

          {loading ? (
            <p className="text-gray-500">
              {/* <CircularProgress /> */}loading ...
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

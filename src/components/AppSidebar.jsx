import {
  Calendar,
  ChevronUp,
  Home,
  House,
  Inbox,
  LayoutDashboard,
  NotebookPen,
  PanelsTopLeft,
  Settings,
  Users,
} from "lucide-react";
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
  SidebarSeparator,
} from "../components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";


import { useState } from "react";




const items = [
  { title: "Dashboard", url: "/admin-dashboard/overview", icon: LayoutDashboard },
  { title: "Listings", url: "/admin-dashboard/listings", icon: Home },
  { title: "Bookings", url: "/admin-dashboard/bookings", icon: NotebookPen },
  { title: "Reviews", url: "/admin-dashboard/reviews", icon: PanelsTopLeft },
  { title: "Messages", url: "/admin-dashboard/messages", icon: Inbox },
  { title: "Users", url: "/admin-dashboard/users", icon: Users },
  { title: "Properties", url: "/admin-dashboard/properties", icon: Calendar },
  { title: "Settings", url: "/admin-dashboard/settings", icon: Settings },
];

const AppSidebar = () => {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(true);



  return (
    <>
      <Sidebar collapsible="icon" defaultOpen={true}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#">
                 <House size={24}/>
                  <span>Listings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarSeparator className="w-auto" />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="text-orange-600" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="mb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    {/* <Avatar
                      sx={{ width: 24, height: 24 }}
                      src={user?.image}
                      alt="User Avatar"
                      className="w-5 h-5"
                    /> */}
                    {/* {user ? `${user.firstName} ${user.lastName}` : "Loading..."} */}
                    User
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setOpen(true)}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>Account</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem
                    className="bg-red-400 text-white"
                    // onClick={handleLogout}
                  >
                    {/* {isLoggingOut ? "Signing Out..." : "Sign Out"} */}
                    signout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Dialog for Profile Edit
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
};

export default AppSidebar;

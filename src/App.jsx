import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import ProjectDocs from "./pages/Projectdocs";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Uploads from "./pages/Uploads";
import Settings from "./pages/Settings";
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const router = createBrowserRouter([
    {path: "/", element: <Home />},
    { path: "/projects/:projectId/docs", element: <ProjectDocs /> },
      { path: "/admin/login", element: <AdminLogin /> },
      { path: "/admin", element: <ProtectedRoute><Admin /></ProtectedRoute> },
      { path: "/admin/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: "/admin/projects", element: <ProtectedRoute><Projects /></ProtectedRoute> },
      { path: "/admin/uploads", element: <ProtectedRoute><Uploads /></ProtectedRoute> },
      { path: "/admin/settings", element: <ProtectedRoute><Settings /></ProtectedRoute> },
    
    
  ]);
  return (
      <RouterProvider router={router} />
  );
  
 
   
}

export default App;

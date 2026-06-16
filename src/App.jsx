import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";
import ProjectDocs from "./pages/Projectdocs";


function App() {
  const router = createBrowserRouter([
    {path: "/", element: <Home />},
    { path: "/projects/:projectId/docs", element: <ProjectDocs /> },
    
    
  ]);
  return (
      <RouterProvider router={router} />
  );
  
 
   
}

export default App;

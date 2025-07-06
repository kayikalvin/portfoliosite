import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";


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

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { UIProvider } from "./components/ui/provider";
import { Toaster } from 'react-hot-toast';

import Login from "./pages/login";
import Signup from "./pages/signup";
import Landingpage from "./pages/landingpage";
import Home from "./pages/home";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Landingpage />,
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/signup",
            element: <Signup />,
        },
        {
            path: "/home",
            element: <Home />,
        }
    ]);

    return (
    <div>
        <UIProvider>
            <RouterProvider router={router}></RouterProvider>
            <Toaster />
        </UIProvider>
    </div>
  );
}

export default App;

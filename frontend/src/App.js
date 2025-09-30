import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { UIProvider } from "./components/ui/provider";

import Login from "./pages/login";
import Signup from "./pages/signup";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <div>ZettaNote</div>,
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
            element: <div>Home</div>,
        }
    ]);

    return (
    <div>
        <UIProvider>
            <RouterProvider router={router}></RouterProvider>
        </UIProvider>
    </div>
  );
}

export default App;

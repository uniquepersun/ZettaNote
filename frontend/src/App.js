import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <div>ZettaNote</div>,
        },
        {
            path: "/login",
            element: <div>Login</div>,
        },
        {
            path: "/signup",
            element: <div>Signup</div>,
        },
        {
            path: "/home",
            element: <div>Home</div>,
        }
    ]);

    return (
    <div>
        <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;

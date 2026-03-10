import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../features/layouts/rootLayout";
import HomePage from "../features/pages/homePage";
import DashboardPage from "../features/dashboard/pages/dashboardPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "dashboard", element: <DashboardPage /> }
        ]
    }
]);

export default router;
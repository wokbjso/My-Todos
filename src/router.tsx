import { basename } from "path";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";

export const router=createBrowserRouter([{
    path:"/",
    element:<App />,
}],{basename:process.env.PUBLIC_URL})
import { Outlet } from "react-router-dom";
import { Navbar } from "../components";

export default function Layout() {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
}
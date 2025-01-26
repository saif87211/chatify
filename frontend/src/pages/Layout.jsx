import { Outlet } from "react-router-dom";
import { Navbar } from "../components";
import { useSelector } from "react-redux";

export default function Layout() {
    const theme = useSelector(state => state.themeSlice.theme);
    return (
        <div data-theme={theme}>
            <Navbar />
            <Outlet />
        </div>
    );
}
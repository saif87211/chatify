import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import auth from "../api/auth";

export default function Navbar() {
    const authStatus = useSelector(state => state.authStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const response = await auth.logout();
        console.log(response);
        dispatch(logout());
        navigate("/");
    };
    return (
        <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80">
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <h1 className="text-lg font-bold">Connectify</h1>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to={"/settings"} className={`btn btn-sm gap-2 transition-colors`}>
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </Link>

                        {authStatus && (
                            <>
                                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                                    <User className="size-5" />
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>
                                <button className="flex gap-2 items-center" onClick={handleLogout}>
                                    <LogOut className="size-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
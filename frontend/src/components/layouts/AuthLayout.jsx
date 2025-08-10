import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Loader as LoaderIcon } from "lucide-react";
import { login, logout } from "../../slices/authSlice";
import auth from "../../api/auth";
import toast from "react-hot-toast";

export default function AuthLayout({ children }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector(state => state.authSlice.authStatus);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAutheticaion = async () => {
            try {
                if (!authStatus) {
                    const user = await auth.getCurrentUser();
                    if (user) {
                        dispatch(login(user));
                    } else {
                        dispatch(logout());
                        navigate("/");
                    }
                }
            } catch (error) {
                const message = error?.response ? (error?.response.data.message) : "Authenticaion error";
                toast.error(message);
                navigate("/");
            } finally {
                setLoader(false);
            }
        }

        checkAutheticaion();
    }, []);

    return (loader ? (
        <div className="flex items-center justify-center h-screen">
            <LoaderIcon className="size-10 animate-spin" />
        </div>
    ) : <>{children}</>);
}
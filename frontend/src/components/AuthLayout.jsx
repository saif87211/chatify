import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader as LoaderIcon } from "lucide-react";

export default function AuthLayout({ children }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector(state => state.authStatus);

    useEffect(() => {
        if (authStatus) {
            navigate("/app");
        } else {
            navigate("/");
        }
        setLoader(false);
    }, [authStatus, navigate]);

    return (loader ? (
        <div className="flex items-center justify-center h-screen">
            <LoaderIcon className="size-10 animate-spin" />
        </div>
    ) : <>{children}</>);
}
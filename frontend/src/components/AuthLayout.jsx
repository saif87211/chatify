import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AuthLayout({ children }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true);
    const authStatus = useSelector(state => state.authStatus);
    console.log(authStatus);
    useEffect(() => {
        if (authStatus) {
            navigate("/app")
        } else {
            navigate("/login");
        }
        setLoader(false);
    }, [authStatus, navigate]);

    return (loader ? <h1>Loading..</h1> : <>{children}</>);
}
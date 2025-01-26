import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import auth from "../api/auth";
import { login } from "../slices/authSlice";

export default function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const authStatus = useSelector(state => state.authSlice.authStatus);

    useEffect(() => {
        if (authStatus) {
            navigate("/app");
        }
    }, []);

    const showPasswordHandler = () => {
        setShowPassword(!showPassword);
    };
    const handleLogin = async (data) => {
        try {
            const response = await auth.login(data);
            if (response.data.loginuser) {
                dispatch(login(response.data.loginuser));
            }
            navigate("/app");
        } catch (error) {
            toast.error(error.response?.data.message || "Something went wrong.");
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium">Mail</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="size-5 text-base-content/40" />
                    </div>
                    <input type="text" className={`input input-bordered w-full pl-10`} placeholder="john@mail.com" {...register("email", {
                        required: true, validate: {
                            matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Email address must be a valid address",
                        }
                    })} />
                </div>
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="size-5 text-base-content/40" />
                    </div>
                    <input type={showPassword ? "text" : "password"} className={`input input-bordered w-full pl-10`} autoComplete="false" placeholder="*********" {...register("password")} />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={showPasswordHandler}>{
                        showPassword ? (<EyeOff className="size-5 text-base-content/40" />) : (<Eye className="size-5 text-base-content/40" />)
                    }</button>
                </div>
            </div>
            <button type="submit" className="btn btn-primary w-full">Login</button>
        </form>);
}
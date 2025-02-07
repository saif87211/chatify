import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { User, AtSign, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "../slices/authSlice"
import authService from "../api/auth";

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit } = useForm();
    const authStatus = useSelector(state => state.authSlice.authStatus);

    useEffect(() => {
        if (authStatus) {
            navigate("/app");
        }
    }, []);

    const showPasswordHandler = () => {
        setShowPassword(!showPassword);
    };
    const create = async (data) => {
        try {
            const registerResponse = await authService.register(data);
            const user = registerResponse?.data.createdUser;
            if (user) {
                toast.success(registerResponse?.message || "Register succefully");
                dispatch(login(user));
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data.message || "Something went wrong.")
        }
    }
    return (
        <form onSubmit={handleSubmit(create)} className="space-y-6">
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="size-5 text-base-content/40" />
                    </div>
                    <input type="text" className={`input input-bordered w-full pl-10`} placeholder="John Dee" {...register("fullname", { required: true, minLength: 3 })} />
                </div>
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text font-medium">Username</span>
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <AtSign className="size-4 text-base-content/40" />
                    </div>
                    <input type="text" className={`input input-bordered w-full pl-10`} placeholder="john1234" {...register("username", { required: true, minLength: 3 })} />
                </div>
            </div>
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
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={showPasswordHandler}>
                        {
                            showPassword ? (<EyeOff className="size-5 text-base-content/40" />) : (<Eye className="size-5 text-base-content/40" />)
                        }
                    </button>
                </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">Create Account</button>
        </form>
    );
}
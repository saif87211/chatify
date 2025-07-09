import { MessageSquare } from "lucide-react";
import { Login as LoginComponent } from "../components";
import chatSvg from "../assets/chat2.svg";
import { Link } from "react-router-dom";
export default function Login() {
    return (
        <div className="h-screen grid lg:grid-cols-2">
            {/* Left Side */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MessageSquare className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                            <p className="text-base-content/60">Sign in to your account</p>
                        </div>
                    </div>
                    <LoginComponent />
                    <div className="text-center">
                        <p className="text-base-content/60">
                            new user?{" "}
                            <Link to="/register" className="link link-primary">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            {/* Right Side */}
            <div className="hidden lg:flex items-center justify-center bg-base-200 p-20">
                <div className="max-w-md text-center">
                    <img className="motion-safe:animate-pulse" src={chatSvg} />
                    <h2 className="text-2xl font-bold mb-4 pt-10">Chatify</h2>
                    <p className="text-base-content/60">Join and chat with you friends and create groups for long talks</p>
                </div>
            </div>
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/auth-service";
import { LogIn, Leaf, Sparkles, ShieldCheck, ArrowRight, Check, Loader2, ShieldAlert, FileText, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    }
  });

  const rememberMe = watch("rememberMe");

  useEffect(() => {
    setMounted(true);
    const session = AuthService.getSession();
    if (session?.isAuthenticated) {
      router.push(session.role === "admin" ? "/dashboard" : "/leave");
    }

    // Load saved username
    const savedUsername = localStorage.getItem("leavemanager_saved_username");
    if (savedUsername) {
      setValue("username", savedUsername);
      setValue("rememberMe", true);
    }
  }, [router, setValue]);

  const handleCaptcha = () => {
    if (captchaVerified || captchaLoading) return;
    setCaptchaLoading(true);
    // Simulate network verification
    setTimeout(() => {
      setCaptchaLoading(false);
      setCaptchaVerified(true);
      clearErrors("root.captcha");
    }, 1500);
  };

  const onSubmit = async (data: LoginFormData) => {
    if (!captchaVerified) {
      setError("root.captcha", { type: "manual", message: "Please verify that you are human." });
      return;
    }

    const session = await AuthService.login(data.username, data.password);
    if (session) {
      // Handle remember me
      if (data.rememberMe) {
        localStorage.setItem("leavemanager_saved_username", data.username);
      } else {
        localStorage.removeItem("leavemanager_saved_username");
      }

      toast.success(`Welcome back, ${session.username}!`, {
        description: `Logged in as ${session.role === "admin" ? "Administrator" : "Employee"}`,
      });
      router.push(session.role === "admin" ? "/dashboard" : "/leave");
    } else {
      toast.error("Invalid credentials", {
        description: "Please check your username and password.",
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030712] text-white flex">
      {/* ═════════ LEFT PANEL: BRANDING (Hidden on Mobile) ═════════ */}
      <div className="hidden lg:flex relative w-1/2 flex-col justify-between overflow-hidden bg-gray-950 p-12 border-r border-white/5">
        
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-emerald-600/20 blur-[120px] animate-[float_10s_ease-in-out_infinite]" />
          <div className="absolute top-[40%] right-[10%] h-[400px] w-[400px] rounded-full bg-teal-600/20 blur-[100px] animate-[float_12s_ease-in-out_infinite_reverse_2s]" />
          <div className="absolute -bottom-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[130px] animate-[float_15s_ease-in-out_infinite_1s]" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
        </div>

        {/* Top Logo */}
        <div className={`relative z-10 flex items-center gap-3 transition-all duration-1000 delay-100 ${mounted ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-900/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Leaf className="h-6 w-6 text-white relative z-10" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">LeaveManager</span>
        </div>

        {/* Center Hero Text */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className={`inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 transition-all duration-1000 delay-300 ${mounted ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}>
            <Sparkles className="h-3.5 w-3.5" />
            Modern Enterprise Solution
          </div>
          <h1 className={`text-5xl font-extrabold leading-[1.1] tracking-tight transition-all duration-1000 delay-500 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            Manage your workforce <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              seamlessly.
            </span>
          </h1>
          <p className={`text-lg text-gray-400 leading-relaxed transition-all duration-1000 delay-700 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
            Streamline employee leave requests, track absences, and maintain operational efficiency with our intelligent dashboard platform.
          </p>
        </div>

        {/* Bottom Feature List */}
        <div className={`relative z-10 flex items-center gap-8 transition-all duration-1000 delay-1000 ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
            <ShieldCheck className="h-5 w-5 text-emerald-400" /> Secure Access
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
            <Leaf className="h-5 w-5 text-teal-400" /> Smart Management
          </div>
        </div>
      </div>


      {/* ═════════ RIGHT PANEL: LOGIN FORM ═════════ */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-hidden">
        
        {/* Mobile Background */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute -top-[20%] -right-[20%] h-[400px] w-[400px] rounded-full bg-emerald-600/20 blur-[100px]" />
          <div className="absolute -bottom-[20%] -left-[20%] h-[400px] w-[400px] rounded-full bg-teal-600/20 blur-[100px]" />
        </div>

        {/* Main Card */}
        <div className={`relative w-full max-w-[440px] transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
          mounted ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"
        }`}>
          
          {/* Card Border Glow */}
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          
          <div className="relative rounded-3xl border border-white/5 bg-white/[0.02] p-8 sm:p-10 shadow-2xl backdrop-blur-2xl">
            
            {/* Mobile Logo */}
            <div className="flex lg:hidden justify-center mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-900/50">
                <Leaf className="h-7 w-7 text-white" />
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
              <p className="text-sm text-gray-400">Enter your credentials to access your account.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2 group">
                  <Label htmlFor="username" className="text-xs font-semibold text-gray-400 uppercase tracking-wider group-focus-within:text-emerald-400 transition-colors">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    {...register("username")}
                    className={`h-12 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all rounded-xl px-4 ${
                      errors.username ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20" : ""
                    }`}
                  />
                  {errors.username && (
                    <p className="text-xs font-medium text-red-400 animate-in slide-in-from-top-1">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2 group">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-gray-400 uppercase tracking-wider group-focus-within:text-emerald-400 transition-colors">
                      Password
                    </Label>
                    <a href="#" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password")}
                      className={`h-12 bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all rounded-xl px-4 pr-12 ${
                        errors.password ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-400 transition-colors p-1 rounded-lg hover:bg-white/5"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-medium text-red-400 animate-in slide-in-from-top-1">{errors.password.message}</p>
                  )}
                </div>

                {/* Save Sign In Option */}
                <div className="flex items-center space-x-2 pt-1">
                  <input 
                    type="checkbox"
                    id="rememberMe" 
                    checked={rememberMe}
                    onChange={(e) => setValue("rememberMe", e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-black/40 text-emerald-500 focus:ring-emerald-500/50 cursor-pointer"
                  />
                  <Label 
                    htmlFor="rememberMe" 
                    className="text-sm font-medium text-gray-300 cursor-pointer select-none"
                  >
                    Save sign in option
                  </Label>
                </div>

                {/* Captcha Simulation */}
                <div className={`mt-4 p-4 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                    errors.root?.captcha ? "border-red-500/50 bg-red-500/5" : 
                    captchaVerified ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 bg-black/40 hover:bg-black/60 hover:border-white/20"
                  }`}
                  onClick={handleCaptcha}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-6 w-6 items-center justify-center rounded border transition-colors duration-300 ${
                      captchaVerified ? "border-emerald-500 bg-emerald-500" : "border-gray-500 bg-transparent"
                    }`}>
                      {captchaLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                      ) : captchaVerified ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : null}
                    </div>
                    <span className={`text-sm font-medium ${captchaVerified ? "text-emerald-400" : "text-gray-300"}`}>
                      {captchaVerified ? "Verification complete" : "I am human"}
                    </span>
                  </div>
                  <ShieldCheck className={`h-6 w-6 opacity-40 ${captchaVerified ? "text-emerald-400" : "text-gray-400"}`} />
                </div>
                {errors.root?.captcha && (
                  <p className="text-xs font-medium text-red-400 animate-in slide-in-from-top-1 flex items-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {errors.root.captcha.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 mt-2 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-900/30 transition-all duration-300 hover:shadow-emerald-900/50 hover:-translate-y-0.5 active:translate-y-0 font-bold text-sm relative overflow-hidden group"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[sweep_1.5s_ease-in-out_infinite]" />
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? "Authenticating..." : "Sign in to Dashboard"}
                  {!isSubmitting && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </span>
              </Button>
            </form>

            <div className="mt-8 text-center space-y-3">
              <Link href="/code-review" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                <FileText className="h-3.5 w-3.5" />
                View Code Review Report
              </Link>
              <p className="text-xs text-gray-500">
                Protected by LeaveManager Security. <br/>
                Unauthorized access is strictly prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

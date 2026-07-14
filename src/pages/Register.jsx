import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import GlassCard from "../components/ui/GlassCard";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";

    if (!email) newErrors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please specify a valid email address";

    if (!password) newErrors.password = "Password field is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    await register(email, password, fullName);
    setIsLoading(false);
    navigate("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
    >
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8 select-none text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] mb-4">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Initialize Profile</h2>
        <p className="text-xs text-gray-400 mt-1 font-medium">Chart your academic orbit in deep space.</p>
      </div>

      <GlassCard className="p-8 border-white/10 bg-black/60 shadow-2xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
          <Input
            label="Full Name"
            type="text"
            placeholder="Alex Mercer"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            required
            disabled={isLoading}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="alex@skillnova.ai"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
            disabled={isLoading}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="glow"
            className="w-full py-3.5 mt-2 font-semibold text-sm animate-pulse-glow"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Launching Profile...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                Initialize Account <ArrowRight size={15} />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400 font-medium">
          Already have an active profile?{" "}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">
            Sign In
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
}

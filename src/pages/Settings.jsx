import React, { useState } from "react";
import { Settings as SettingsIcon, Save, Sparkles, User, Shield, Sliders } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../contexts/TaskContext";
import { mockCareers } from "../data/mockCareers";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Settings() {
  const { user } = useAuth();
  const { careerTrack, switchCareerTrack } = useTasks();

  const [fullName, setFullName] = useState(user?.name || "Alex Mercer");
  const [email, setEmail] = useState(user?.email || "alex@skillnova.ai");
  const [selectedTrack, setSelectedTrack] = useState(careerTrack);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);

      // Perform track switch
      if (selectedTrack !== careerTrack) {
        switchCareerTrack(selectedTrack);
      }

      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto text-left flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="text-violet-400 w-8 h-8 animate-spin-slow" />
          System Settings
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Adjust your active profile coordinates, career alignment configurations, and platform nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side Menu List */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <GlassCard className="p-4 flex flex-col gap-1 text-left">
            <button className="w-full text-left px-3.5 py-3 rounded-xl bg-violet-950/20 border-l-2 border-violet-500 text-white font-semibold text-xs flex items-center gap-2.5">
              <User size={14} className="text-violet-400" /> Profile Configurations
            </button>
            <button className="w-full text-left px-3.5 py-3 rounded-xl text-gray-500 hover:text-white font-semibold text-xs flex items-center gap-2.5 transition-colors cursor-not-allowed">
              <Shield size={14} /> Security Keys
            </button>
            <button className="w-full text-left px-3.5 py-3 rounded-xl text-gray-500 hover:text-white font-semibold text-xs flex items-center gap-2.5 transition-colors cursor-not-allowed">
              <Sliders size={14} /> System Parameters
            </button>
          </GlassCard>
        </div>

        {/* Right Settings panel */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3 mb-6">
              <Sparkles size={14} className="text-violet-400" />
              Adjust Coordinates
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <Input
                label="Full Profile Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSaving}
              />

              <Input
                label="Email Vector Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSaving}
              />

              {/* Career track select box */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                  Active Career Spec Roadmap
                </label>
                <select
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-violet-500/50 focus:bg-white/10 transition-all duration-300"
                  disabled={isSaving}
                >
                  {mockCareers.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0a081c] text-white">
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action and feedback row */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <span className="text-xs text-gray-500 font-medium">
                  {saveSuccess && (
                    <span className="text-emerald-400 font-semibold animate-pulse">
                      ✓ Profile coordinates successfully synchronized!
                    </span>
                  )}
                </span>
                
                <Button type="submit" variant="glow" disabled={isSaving}>
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Syncing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Save size={14} /> Synchronize Profile
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}

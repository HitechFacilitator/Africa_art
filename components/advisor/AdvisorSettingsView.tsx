"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";
import { adminApi } from "@/lib/api";
import { Settings, User, Bell, Shield, Save, Eye, EyeOff, Lock } from "lucide-react";

export default function AdvisorSettingsView() {
  const { lang } = useTranslate();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "Dr. Fatima Benali");
  const [email, setEmail] = useState(user?.email || "dr.fatima@louvre.fr");
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = async () => {
    setPwError("");
    if (!currentPassword || !newPassword) {
      setPwError(lang === "fr" ? "Veuillez remplir tous les champs" : "Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError(lang === "fr" ? "Les mots de passe ne correspondent pas" : "Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPwError(lang === "fr" ? "Le mot de passe doit contenir au moins 6 caractères" : "Password must be at least 6 characters");
      return;
    }
    setPwSaving(true);
    try {
      await adminApi.changePassword({ currentPassword, newPassword });
      setPwSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwSaved(false), 2000);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : (lang === "fr" ? "Échec du changement de mot de passe" : "Failed to change password"));
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div>
      <header className="mb-8 pb-6 border-b border-ebony-deep/10">
        <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Paramètres" : "Settings"}</h2>
        <p className="font-sans text-xs text-ebony-deep/40 mt-1">{lang === "fr" ? "Gérez votre profil et préférences de conseiller." : "Manage your advisor profile and preferences."}</p>
      </header>

      <div className="max-w-2xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-parchment-ivory border border-ebony-deep/10 p-6">
          <h3 className="font-serif text-base font-medium text-ebony-deep mb-4 flex items-center gap-2"><User className="w-4 h-4 text-terracotta-earth" /> {lang === "fr" ? "Profil Conseiller" : "Advisor Profile"}</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1.5 block">{lang === "fr" ? "Nom" : "Name"}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 bg-surface-container-low border border-ebony-deep/10 text-sm font-sans text-ebony-deep focus:outline-none focus:border-terracotta-earth/30 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1.5 block">{lang === "fr" ? "Courriel" : "Email"}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 bg-surface-container-low border border-ebony-deep/10 text-sm font-sans text-ebony-deep focus:outline-none focus:border-terracotta-earth/30 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1.5 block">{lang === "fr" ? "Rôle" : "Role"}</label>
              <div className="px-3 py-2.5 bg-surface-container-low border border-ebony-deep/10 text-sm font-sans text-terracotta-earth">{lang === "fr" ? "Conseiller en Art" : "Art Advisor"}</div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-parchment-ivory border border-ebony-deep/10 p-6">
          <h3 className="font-serif text-base font-medium text-ebony-deep mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-terracotta-earth" /> {lang === "fr" ? "Notifications" : "Notifications"}</h3>
          <div className="space-y-3">
            {[
              { label: lang === "fr" ? "Nouvelles consultations" : "New consultations", checked: true },
              { label: lang === "fr" ? "Mises à jour des placements" : "Placement updates", checked: true },
              { label: lang === "fr" ? "Alertes clients" : "Client alerts", checked: true },
              { label: lang === "fr" ? "Rappels de suivi" : "Follow-up reminders", checked: false },
            ].map(n => (
              <label key={n.label} className="flex items-center gap-3 cursor-pointer">
                <div className={`w-9 h-5 rounded-full relative transition-colors ${n.checked ? "bg-terracotta-earth" : "bg-ebony-deep/10"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${n.checked ? "left-4.5" : "left-0.5"}`} />
                </div>
                <span className="font-sans text-xs text-ebony-deep">{n.label}</span>
              </label>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-parchment-ivory border border-ebony-deep/10 p-6">
          <h3 className="font-serif text-base font-medium text-ebony-deep mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-terracotta-earth" /> {lang === "fr" ? "Sécurité" : "Security"}</h3>
          <div className="space-y-3">
            <div className="relative">
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1.5 block">{lang === "fr" ? "Mot de Passe Actuel" : "Current Password"}</label>
              <input type={showCurrentPw ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-3 py-2.5 pr-8 bg-surface-container-low border border-ebony-deep/10 text-sm font-sans text-ebony-deep focus:outline-none focus:border-terracotta-earth/30 transition-colors" />
              <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-[26px] text-ebony-deep/40 hover:text-ebony-deep cursor-pointer border-0 bg-transparent">
                {showCurrentPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="relative">
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1.5 block">{lang === "fr" ? "Nouveau Mot de Passe" : "New Password"}</label>
              <input type={showNewPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2.5 pr-8 bg-surface-container-low border border-ebony-deep/10 text-sm font-sans text-ebony-deep focus:outline-none focus:border-terracotta-earth/30 transition-colors" />
              <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-[26px] text-ebony-deep/40 hover:text-ebony-deep cursor-pointer border-0 bg-transparent">
                {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div>
              <label className="text-[10px] font-sans font-bold uppercase tracking-widest text-ebony-deep/40 mb-1.5 block">{lang === "fr" ? "Confirmer" : "Confirm Password"}</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2.5 bg-surface-container-low border border-ebony-deep/10 text-sm font-sans text-ebony-deep focus:outline-none focus:border-terracotta-earth/30 transition-colors" />
            </div>
            {pwError && <p className="text-xs text-red-600 font-sans">{pwError}</p>}
            <button onClick={handleChangePassword} disabled={pwSaving} className="px-4 py-2 border border-ebony-deep/20 text-terracotta-earth text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-terracotta-earth/5 transition-colors cursor-pointer bg-transparent disabled:opacity-50">
              {pwSaving ? "..." : pwSaved ? "✓ Saved" : (lang === "fr" ? "Changer le Mot de Passe" : "Change Password")}
            </button>
          </div>
        </motion.div>

        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-terracotta-earth text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:bg-terracotta-earth/90 transition-colors cursor-pointer border-0">
          <Save className="w-3.5 h-3.5" /> {saved ? (lang === "fr" ? "Enregistré !" : "Saved!") : (lang === "fr" ? "Enregistrer les Modifications" : "Save Changes")}
        </button>
      </div>
    </div>
  );
}

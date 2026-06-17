"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";
import { adminApi } from "@/lib/api";
import { Settings, User, Bell, Shield, ShieldCheck, Save, Eye, EyeOff, Lock } from "lucide-react";

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

  const [twoFAEnabled, setTwoFAEnabled] = useState(user?.twoFactorEnabled ?? false);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [twoFAConfirmPassword, setTwoFAConfirmPassword] = useState("");
  const [show2FAConfirm, setShow2FAConfirm] = useState(false);
  const [twoFAError, setTwoFAError] = useState("");

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

  const handleToggle2FA = async () => {
    setTwoFALoading(true);
    setTwoFAError("");
    try {
      if (twoFAEnabled) {
        if (!show2FAConfirm) {
          setShow2FAConfirm(true);
          setTwoFALoading(false);
          return;
        }
        if (!twoFAConfirmPassword) {
          setTwoFALoading(false);
          return;
        }
        await adminApi.disable2FA(twoFAConfirmPassword);
        setTwoFAEnabled(false);
        setShow2FAConfirm(false);
        setTwoFAConfirmPassword("");
      } else {
        await adminApi.enable2FA();
        setTwoFAEnabled(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Operation failed";
      setTwoFAError(msg);
    } finally {
      setTwoFALoading(false);
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

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-parchment-ivory border border-ebony-deep/10 p-6">
          <h3 className="font-serif text-base font-medium text-ebony-deep mb-4 flex items-center gap-2">
            {twoFAEnabled ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <Shield className="w-4 h-4 text-terracotta-earth" />}
            {lang === "fr" ? "Authentification à Deux Facteurs" : "Two-Factor Authentication"}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-sans text-xs font-medium text-ebony-deep">
                  {twoFAEnabled ? (lang === "fr" ? "2FA Activé" : "2FA Enabled") : (lang === "fr" ? "2FA Désactivé" : "2FA Disabled")}
                </p>
                <p className="font-sans text-[10px] text-ebony-deep/50">
                  {twoFAEnabled
                    ? (lang === "fr" ? "Un code OTP est requis à chaque connexion" : "An OTP code is required on each login")
                    : (lang === "fr" ? "Ajoutez une couche de sécurité supplémentaire" : "Add an extra layer of security")}
                </p>
              </div>
              <button onClick={handleToggle2FA} disabled={twoFALoading} className={`w-11 h-6 rounded-full transition-colors relative ${twoFAEnabled ? "bg-emerald-600" : "bg-ebony-deep/10"}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${twoFAEnabled ? "left-6" : "left-1"}`} />
              </button>
            </div>
            {twoFAEnabled && show2FAConfirm && (
              <div className="space-y-2 border-t border-ebony-deep/5 pt-3">
                <p className="text-[10px] text-ebony-deep/50">{lang === "fr" ? "Entrez votre mot de passe pour désactiver :" : "Enter your password to disable:"}</p>
                <input type="password" value={twoFAConfirmPassword} onChange={(e) => setTwoFAConfirmPassword(e.target.value)} placeholder={lang === "fr" ? "Mot de passe" : "Password"} className="w-full px-3 py-2 bg-surface-container-low border border-ebony-deep/10 text-xs font-sans text-ebony-deep focus:outline-none focus:border-terracotta-earth/30 transition-colors" />
                <button onClick={handleToggle2FA} disabled={twoFALoading || !twoFAConfirmPassword} className="bg-red-600 text-white text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1.5 hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer border-0">
                  {twoFALoading ? "..." : (lang === "fr" ? "Désactiver" : "Disable")}
                </button>
                {twoFAError && <p className="text-xs text-red-600 font-sans">{twoFAError}</p>}
              </div>
            )}
          </div>
        </motion.div>

        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-terracotta-earth text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:bg-terracotta-earth/90 transition-colors cursor-pointer border-0">
          <Save className="w-3.5 h-3.5" /> {saved ? (lang === "fr" ? "Enregistré !" : "Saved!") : (lang === "fr" ? "Enregistrer les Modifications" : "Save Changes")}
        </button>
      </div>
    </div>
  );
}

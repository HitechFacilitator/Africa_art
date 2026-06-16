"use client";

import { useState } from "react";
import { useTranslate } from "@/lib/translations";
import { adminApi } from "@/lib/api";
import {
  Settings,
  Server,
  Cpu,
  Radio,
  Mail,
  Save,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsView() {
  const { lang } = useTranslate();
  const [rpcUrl, setRpcUrl] = useState("https://rpc.aduna-gallery.ch/v2");
  const [regEmail, setRegEmail] = useState("compliance@aduna-gallery.ch");
  const [autoRevoke, setAutoRevoke] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
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
      <h2 className="font-serif text-2xl font-medium text-ebony-deep mb-6">
        {lang === "fr" ? "Paramètres du Nœud Système" : "System Node Settings"}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* Form */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/30 p-6">
          <h3 className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-4">
            {lang === "fr" ? "Configuration du Nœud" : "Node Configuration"}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1.5">
                {lang === "fr" ? "URL du Point de Terminaison RPC" : "RPC Endpoint URL"}
              </label>
              <input
                type="url"
                value={rpcUrl}
                onChange={(e) => setRpcUrl(e.target.value)}
                className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-mono text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf"
              />
            </div>

            <div>
              <label className="block text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1.5">
                {lang === "fr" ? "Email de Conformité Réglementaire" : "Regulatory Compliance Email"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-outline-variant/20">
              <div>
                <p className="font-sans text-sm font-medium text-ebony-deep">
                  {lang === "fr" ? "Protocole de Révocation Automatique" : "Auto-Revocation Protocol"}
                </p>
                <p className="font-sans text-[11px] text-on-surface-variant">
                  Automatically revoke access for expired certificates
                </p>
              </div>
              <button
                onClick={() => setAutoRevoke(!autoRevoke)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  autoRevoke ? "bg-gold-leaf" : "bg-outline-variant/50"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                    autoRevoke ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-ebony-deep text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-parchment-ivory/30 border-t-parchment-ivory rounded-full animate-spin" />
                  {lang === "fr" ? "Enregistrement..." : "Saving..."}
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" /> {lang === "fr" ? "Enregistré" : "Saved"}
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> {lang === "fr" ? "Enregistrer les Paramètres" : "Save Settings"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Health monitors */}
        <div className="lg:col-span-3">
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-6">
            <h3 className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-4">
              {lang === "fr" ? "Moniteurs de Santé du Nœud" : "Node Health Monitors"}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-on-surface-variant/60" />
                  <div>
                    <p className="font-sans text-xs font-medium text-ebony-deep">{lang === "fr" ? "Utilisation du CPU" : "CPU Usage"}</p>
                    <p className="font-sans text-[10px] text-on-surface-variant">
                      Ledger processing node
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-emerald-700 font-semibold">23%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-on-surface-variant/60" />
                  <div>
                    <p className="font-sans text-xs font-medium text-ebony-deep">{lang === "fr" ? "Synchronisation Vite" : "Vite Sync"}</p>
                    <p className="font-sans text-[10px] text-on-surface-variant">
                      Build & hot reload
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-emerald-700 font-semibold">{lang === "fr" ? "Actif" : "Active"}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <Server className="w-4 h-4 text-on-surface-variant/60" />
                  <div>
                    <p className="font-sans text-xs font-medium text-ebony-deep">{lang === "fr" ? "Nœuds Pairs" : "Peer Nodes"}</p>
                    <p className="font-sans text-[10px] text-on-surface-variant">
                      Distributed network
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-emerald-700 font-semibold">12 / 12</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="mt-8 bg-surface-container-lowest border border-outline-variant/30 p-6 max-w-lg">
        <h3 className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          {lang === "fr" ? "Changer le Mot de Passe" : "Change Password"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1.5">
              {lang === "fr" ? "Mot de Passe Actuel" : "Current Password"}
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf"
              />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-ebony-deep cursor-pointer border-0 bg-transparent">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1.5">
              {lang === "fr" ? "Nouveau Mot de Passe" : "New Password"}
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-ebony-deep cursor-pointer border-0 bg-transparent">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1.5">
              {lang === "fr" ? "Confirmer le Nouveau Mot de Passe" : "Confirm New Password"}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf"
            />
          </div>

          {pwError && (
            <p className="text-xs text-red-600 font-sans">{pwError}</p>
          )}

          <button
            onClick={handleChangePassword}
            disabled={pwSaving}
            className="flex items-center gap-2 px-4 py-2.5 bg-ebony-deep text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-0"
          >
            {pwSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-parchment-ivory/30 border-t-parchment-ivory rounded-full animate-spin" />
                {lang === "fr" ? "Enregistrement..." : "Saving..."}
              </>
            ) : pwSaved ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" /> {lang === "fr" ? "Enregistré" : "Saved"}
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" /> {lang === "fr" ? "Changer le Mot de Passe" : "Change Password"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

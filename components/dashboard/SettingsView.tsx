"use client";

import { useState } from "react";
import { CollectorProfile } from "@/lib/dashboardTypes";
import {
  User,
  Globe,
  RefreshCw,
  Sparkles,
  Check,
  Moon,
  Sun,
  Crown,
  Lock,
  Wallet,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { useTranslate } from "@/lib/translations";
import { adminApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface SettingsViewProps {
  profile: CollectorProfile;
  setProfile: (profile: CollectorProfile) => void;
  onClearCache: () => void;
  theme: string;
  onToggleTheme: () => void;
}

export default function SettingsView({ profile, setProfile, onClearCache, theme, onToggleTheme }: SettingsViewProps) {
  const { lang } = useTranslate();
  const { user } = useAuth();
  const [collectorName, setCollectorName] = useState(profile.name);
  const [currency, setCurrency] = useState(profile.currency);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(profile.regionsOfInterest);
  const [savingStatus, setSavingStatus] = useState(false);

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

  const availableRegions = [
    'West Africa (Edo, Yoruba, Akan)',
    'East Africa (Ethiopian Coptic, Swahili Modern)',
    'Nile Valley & Nubian Antiquities',
    'Contemporary African Sculpture',
    'Central African Kingdom Weaves (Kuba, Luba)'
  ];

  const handleToggleRegion = (rg: string) => {
    if (selectedRegions.includes(rg)) {
      setSelectedRegions(selectedRegions.filter(r => r !== rg));
    } else {
      setSelectedRegions([...selectedRegions, rg]);
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStatus(true);
    setTimeout(() => {
      setProfile({ ...profile, name: collectorName, currency: currency, regionsOfInterest: selectedRegions });
      setSavingStatus(false);
      alert(lang === "fr" ? 'Paramètres du collectionneur synchronisés avec les serveurs sécurisés Aduna avec succès.' : 'Collector settings synchronized with Aduna secure mainframes successfully.');
    }, 600);
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
    <div className="animate-fade-in text-on-surface">
      <header className="mb-10 pb-6 border-b border-ebony-deep/10">
        <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Coordonnées Système et Profil" : "System Coordinates & Profile"}</h2>
        <p className="font-sans text-xs text-on-surface-variant mt-1">{lang === "fr" ? "Examinez les identifiants premium, ajustez les indices de valorisation des devises, sélectionnez les directives d'intérêts curatoriaux et basculez les options de mode sombre ambiant." : "Review premium credentials, adjust currency valuation indexes, select curatorial interest directives, and toggle ambient dark mode options."}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-parchment-ivory border border-ebony-deep/5 p-8 shadow-level-1">
          <form onSubmit={handleSaveChanges} className="space-y-8">
            <div className="border-b border-ebony-deep/5 pb-6">
              <h3 className="font-serif text-base font-semibold text-ebony-deep mb-4 flex items-center gap-2"><User className="w-4.5 h-4.5" /> {lang === "fr" ? "Identifiants du Profil Collectionneur" : "Collector Profile Credentials"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5">{lang === "fr" ? "Nom Enregistré Premium" : "Premium Registered Name"}</label>
                  <input type="text" value={collectorName} onChange={(e) => setCollectorName(e.target.value)} className="bg-white border border-ebony-deep/15 focus:border-gold-leaf p-3 text-xs focus:outline-none text-ebony-deep" />
                </div>
                <div className="flex flex-col">
                  <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5">{lang === "fr" ? "Standard de Sécurité du Compte" : "Account Security Standard"}</label>
                  <div className="bg-zinc-100 p-3 text-xs text-zinc-500 flex items-center justify-between border-l-2 border-l-gold-leaf">
                    <span className="font-serif font-medium text-gold-leaf uppercase">{lang === "fr" ? "Niveau Conseiller d'Investissement Prestige" : "Prestige Investment Advisor Tier"}</span>
                    <Crown className="w-4 h-4 text-gold-leaf" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-ebony-deep/5 pb-6">
              <h3 className="font-serif text-base font-semibold text-ebony-deep mb-4 flex items-center gap-2"><Globe className="w-4.5 h-4.5" /> {lang === "fr" ? "Devise de Valeur du Système" : "System Valuation Currency"}</h3>
              <div className="flex flex-wrap gap-4">
                {['EUR (€)', 'USD ($)', 'GBP (£)'].map((curr) => (
                  <label key={curr} className={`flex items-center gap-2 px-4 py-3 border cursor-pointer select-none text-xs font-sans transition-colors ${currency === curr ? 'border-gold-leaf bg-white text-ebony-deep font-bold' : 'border-ebony-deep/5 text-zinc-400 bg-zinc-50/50'}`}>
                    <input type="radio" name="currency_pref" value={curr} checked={currency === curr} onChange={() => setCurrency(curr)} className="hidden" />{curr}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-b border-ebony-deep/5 pb-6">
              <h3 className="font-serif text-base font-semibold text-ebony-deep mb-4 flex items-center gap-2"><Sparkles className="w-4.5 h-4.5" /> {lang === "fr" ? "Répertoires d'Intérêts Curatoriaux" : "Curatorial Interest Directories"}</h3>
              <p className="font-sans text-xs text-zinc-500 mb-3.5 leading-normal">{lang === "fr" ? "Les algorithmes à enjeux élevés d'Aduna Gallery sélectionnent personnellement les recommandations de placement privé basées sur les régions choisies :" : "Aduna Gallery's high-stake algorithms custom-curate private placement recommendations based on chosen regions:"}</p>
              <div className="space-y-2.5">
                {availableRegions.map((rg) => {
                  const isChecked = selectedRegions.includes(rg);
                  return (
                    <div key={rg} onClick={() => handleToggleRegion(rg)} className={`p-3 border text-xs font-sans cursor-pointer transition-colors flex items-center justify-between ${isChecked ? 'border-gold-leaf bg-white font-medium text-ebony-deep' : 'border-ebony-deep/5 hover:border-zinc-400 text-zinc-550'}`}>
                      <span>{rg}</span>
                      {isChecked ? <Check className="w-4 h-4 text-emerald-600" /> : <div className="w-4 h-4 border border-zinc-300" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pb-4">
              <h3 className="font-serif text-base font-semibold text-ebony-deep mb-4 flex items-center gap-2">
                {theme === 'dark' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
                {lang === "fr" ? "Thème d'Affichage Ambiant" : "Ambient Display Theme"}
              </h3>
              <div className="flex flex-wrap gap-4">
                <button type="button" onClick={() => { if (theme === 'dark') onToggleTheme(); }} className={`flex items-center gap-2 px-4 py-3 border cursor-pointer text-xs font-sans ${theme === 'light' ? 'border-gold-leaf bg-white text-ebony-deep font-bold' : 'border-ebony-deep/5 text-zinc-400 bg-zinc-50/50'}`}>
                  <Sun className="w-4 h-4 text-gold-leaf" /> {lang === "fr" ? "Musée Ivoire Clair" : "Museum Ivory Light"} (Default Premium)
                </button>
                <button type="button" onClick={() => { if (theme === 'light') onToggleTheme(); }} className={`flex items-center gap-2 px-4 py-3 border cursor-pointer text-xs font-sans ${theme === 'dark' ? 'border-gold-leaf bg-white text-gold-leaf font-bold' : 'border-ebony-deep/5 text-zinc-500 bg-zinc-50/50'}`}>
                  <Moon className="w-4 h-4 text-gold-leaf" /> {lang === "fr" ? "Ébène Foncé Profond" : "Ebony Dark Deep"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={savingStatus} className="bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-8 py-3.5 hover:opacity-90 active:scale-98 transition-all duration-300 disabled:opacity-50 cursor-pointer border-0">
              {savingStatus ? (lang === "fr" ? "Synchronisation..." : 'Synchronizing...') : (lang === "fr" ? "Certifier les Paramètres du Profil" : 'Certify Profile Parameters')}
            </button>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-parchment-ivory border border-ebony-deep/5 p-8 shadow-level-1 space-y-6">
            <h3 className="font-serif text-lg font-medium text-ebony-deep border-b border-gold-leaf/20 pb-4 flex items-center gap-2"><Lock className="w-4.5 h-4.5 text-gold-leaf" /> {lang === "fr" ? "Sécuriser les Grands Systèmes" : "Secure Mainframes"}</h3>
            <div className="space-y-4 font-sans text-xs text-zinc-500 leading-relaxed">
              <p>{lang === "fr" ? "Pour protéger les coordonnées d'identité du collectionneur, tous les identifiants et profils système sont stockés localement de manière cryptographique. Aucune métrique de collections privées ne traverse jamais les protocoles HTTP ouverts." : "To safeguard the collector identity coordinates, all credentials and system profiles are cryptographically stored locally. No private collections metrics ever traverse clear open HTTP protocols."}</p>
              <div className="bg-zinc-100 p-4 border border-ebony-deep/5 space-y-2">
                <p className="font-bold text-ebony-deep uppercase tracking-wider text-[10px] flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-gold-leaf" /> {lang === "fr" ? "Purification de l'État" : "State Purifying"}</p>
                <p className="text-[11px] leading-relaxed">{lang === "fr" ? "Réinitialisez les matrices de registre locales aux normes usine de musée pristine. Cela supprime les acquisitions ajoutées." : "Reset local registry matrices back to pristine factory museum standards. This deletes custom added acquisitions."}</p>
                <button type="button" onClick={() => { if (confirm(lang === "fr" ? "Vérifier : Purifier les caches de l'état client ? Les journaux d'acquisitions, de consultations et de demandes ajoutés reviendront aux normes par défaut du musée." : "Verify: Purify client state caches? Added acquisitions, consultations, and inquiries logs will revert back to default museum standards.")) { onClearCache(); } }} className="bg-amber-100 hover:bg-amber-200 text-[#B35C44] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 mt-2 transition-colors border-0 cursor-pointer">
                  {lang === "fr" ? "État de Purification Usine" : "Factory Purify State"}
                </button>
              </div>
              <div className="space-y-2 border-t border-ebony-deep/5 pt-4">
                <p className="font-mono text-[10px] text-zinc-400 select-all font-semibold flex items-center gap-1"><Wallet className="w-3.5 h-3.5 text-gold-leaf" /> PRIVATE CHAIN ID: ETH-MAIN-ADUNA-99</p>
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="bg-parchment-ivory border border-ebony-deep/5 p-8 shadow-level-1">
            <h3 className="font-serif text-lg font-medium text-ebony-deep border-b border-gold-leaf/20 pb-4 flex items-center gap-2 mb-4">
              <Lock className="w-4.5 h-4.5 text-gold-leaf" /> {lang === "fr" ? "Changer le Mot de Passe" : "Change Password"}
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5 block">{lang === "fr" ? "Mot de Passe Actuel" : "Current Password"}</label>
                <input type={showCurrentPw ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-white border border-ebony-deep/15 focus:border-gold-leaf p-2.5 text-xs focus:outline-none text-ebony-deep pr-8" />
                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-2.5 top-[26px] text-zinc-400 hover:text-ebony-deep cursor-pointer border-0 bg-transparent">
                  {showCurrentPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="relative">
                <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5 block">{lang === "fr" ? "Nouveau Mot de Passe" : "New Password"}</label>
                <input type={showNewPw ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-white border border-ebony-deep/15 focus:border-gold-leaf p-2.5 text-xs focus:outline-none text-ebony-deep pr-8" />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-2.5 top-[26px] text-zinc-400 hover:text-ebony-deep cursor-pointer border-0 bg-transparent">
                  {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div>
                <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5 block">{lang === "fr" ? "Confirmer" : "Confirm Password"}</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-white border border-ebony-deep/15 focus:border-gold-leaf p-2.5 text-xs focus:outline-none text-ebony-deep" />
              </div>
              {pwError && <p className="text-xs text-red-600 font-sans">{pwError}</p>}
              <button type="button" onClick={handleChangePassword} disabled={pwSaving} className="bg-ebony-deep text-parchment-ivory font-sans text-[10px] font-semibold uppercase tracking-widest px-4 py-2 hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer border-0">
                {pwSaving ? "..." : pwSaved ? "✓ Saved" : (lang === "fr" ? "Changer" : "Change Password")}
              </button>
            </div>
          </div>

          {/* 2FA */}
          <div className="bg-parchment-ivory border border-ebony-deep/5 p-8 shadow-level-1">
            <h3 className="font-serif text-lg font-medium text-ebony-deep border-b border-gold-leaf/20 pb-4 flex items-center gap-2 mb-4">
              {twoFAEnabled ? <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" /> : <Shield className="w-4.5 h-4.5 text-gold-leaf" />}
              {lang === "fr" ? "Authentification à Deux Facteurs" : "Two-Factor Authentication"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-sans text-xs font-medium text-ebony-deep">
                    {twoFAEnabled ? (lang === "fr" ? "2FA Activé" : "2FA Enabled") : (lang === "fr" ? "2FA Désactivé" : "2FA Disabled")}
                  </p>
                  <p className="font-sans text-[10px] text-zinc-500">
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
                  <p className="text-[10px] text-zinc-500">{lang === "fr" ? "Entrez votre mot de passe pour désactiver :" : "Enter your password to disable:"}</p>
                  <input type="password" value={twoFAConfirmPassword} onChange={(e) => setTwoFAConfirmPassword(e.target.value)} placeholder={lang === "fr" ? "Mot de passe" : "Password"} className="w-full bg-white border border-ebony-deep/15 focus:border-gold-leaf p-2 text-xs focus:outline-none text-ebony-deep" />
                  <button onClick={handleToggle2FA} disabled={twoFALoading || !twoFAConfirmPassword} className="bg-red-600 text-white font-sans text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer border-0">
                    {twoFALoading ? "..." : (lang === "fr" ? "Désactiver" : "Disable")}
                  </button>
                  {twoFAError && <p className="text-xs text-red-600 font-sans">{twoFAError}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
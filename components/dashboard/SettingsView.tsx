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
  Wallet
} from "lucide-react";
import { useTranslate } from "@/lib/translations";

interface SettingsViewProps {
  profile: CollectorProfile;
  setProfile: (profile: CollectorProfile) => void;
  onClearCache: () => void;
  theme: string;
  onToggleTheme: () => void;
}

export default function SettingsView({ profile, setProfile, onClearCache, theme, onToggleTheme }: SettingsViewProps) {
  const { lang } = useTranslate();
  const [collectorName, setCollectorName] = useState(profile.name);
  const [currency, setCurrency] = useState(profile.currency);
  const [selectedRegions, setSelectedRegions] = useState<string[]>(profile.regionsOfInterest);
  const [savingStatus, setSavingStatus] = useState(false);

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
      alert('Collector settings synchronized with Aduna secure mainframes successfully.');
    }, 600);
  };

  return (
    <div className="animate-fade-in text-on-surface">
      <header className="mb-10 pb-6 border-b border-ebony-deep/10">
        <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Coordonnées Système et Profil" : "System Coordinates & Profile"}</h2>
        <p className="font-sans text-xs text-on-surface-variant mt-1">Review premium credentials, adjust currency valuation indexes, select curatorial interest directives, and toggle ambient dark mode options.</p>
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
                    <span className="font-serif font-medium text-gold-leaf uppercase">Prestige Investment Advisor Tier</span>
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
              <p className="font-sans text-xs text-zinc-500 mb-3.5 leading-normal">Aduna Gallery&apos;s high-stake algorithms custom-curate private placement recommendations based on chosen regions:</p>
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
              <p>To safeguard the collector identity coordinates, all credentials and system profiles are cryptographically stored locally. No private collections metrics ever traverse clear open HTTP protocols.</p>
              <div className="bg-zinc-100 p-4 border border-ebony-deep/5 space-y-2">
                <p className="font-bold text-ebony-deep uppercase tracking-wider text-[10px] flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-gold-leaf" /> State Purifying</p>
                <p className="text-[11px] leading-relaxed">Reset local registry matrices back to pristine factory museum standards. This deletes custom added acquisitions.</p>
                <button type="button" onClick={() => { if (confirm('Verify: Purify client state caches? Added acquisitions, consultations, and inquiries logs will revert back to default museum standards.')) { onClearCache(); } }} className="bg-amber-100 hover:bg-amber-200 text-[#B35C44] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 mt-2 transition-colors border-0 cursor-pointer">
                  {lang === "fr" ? "État de Purification Usine" : "Factory Purify State"}
                </button>
              </div>
              <div className="space-y-2 border-t border-ebony-deep/5 pt-4">
                <p className="font-mono text-[10px] text-zinc-400 select-all font-semibold flex items-center gap-1"><Wallet className="w-3.5 h-3.5 text-gold-leaf" /> PRIVATE CHAIN ID: ETH-MAIN-ADUNA-99</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { useAuth } from "@/lib/auth";
import { Settings, User, Bell, Shield, Save } from "lucide-react";

export default function AdvisorSettingsView() {
  const { lang } = useTranslate();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "Dr. Fatima Benali");
  const [email, setEmail] = useState(user?.email || "dr.fatima@louvre.fr");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          <p className="font-sans text-xs text-ebony-deep/50 mb-3">{lang === "fr" ? "Dernière connexion : 15 Juin 2026, 09:32 UTC" : "Last login: June 15, 2026, 09:32 UTC"}</p>
          <button className="px-4 py-2 border border-ebony-deep/20 text-terracotta-earth text-[10px] font-sans font-bold uppercase tracking-widest hover:bg-terracotta-earth/5 transition-colors cursor-pointer bg-transparent">{lang === "fr" ? "Changer le Mot de Passe" : "Change Password"}</button>
        </motion.div>

        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-terracotta-earth text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:bg-terracotta-earth/90 transition-colors cursor-pointer border-0">
          <Save className="w-3.5 h-3.5" /> {saved ? (lang === "fr" ? "Enregistré !" : "Saved!") : (lang === "fr" ? "Enregistrer les Modifications" : "Save Changes")}
        </button>
      </div>
    </div>
  );
}

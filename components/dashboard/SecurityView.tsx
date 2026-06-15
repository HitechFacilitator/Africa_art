"use client";

import { SecurityRecord } from "@/lib/dashboardTypes";
import {
  Fingerprint,
  Cpu,
  Thermometer,
  Lock,
  FileDigit,
  Activity,
  HeartPulse
} from "lucide-react";
import { useTranslate } from "@/lib/translations";

interface SecurityViewProps {
  records: SecurityRecord[];
}

export default function SecurityView({ records }: SecurityViewProps) {
  const { lang } = useTranslate();
  return (
    <div className="animate-fade-in text-on-surface">
      <header className="mb-10 pb-6 border-b border-ebony-deep/10">
        <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Actes Cryptographiques et Coffres-Forts" : "Cryptographic Deeds & Vault Vaults"}</h2>
        <p className="font-sans text-xs text-on-surface-variant mt-1">{lang === "fr" ? "Vérifiez les hachages d'authenticité numérique de vos œuvres physiques rares. Journalisation en temps réel de la température, de l'humidité, des scans biométriques et des certifications d'assurance syndiquées AXA." : "Verify digital authenticity hashes of your rare physical art. Real-time logging of temperature, humidity, biometric scans, and AXA-syndicated insurance certifications."}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h3 className="font-serif text-lg font-medium text-ebony-deep mb-2">{lang === "fr" ? "Coordonnées des Chambres de Coffre-Fort Actives" : "Active Vault Chambers Coordinates"}</h3>
          {records.map((rec) => (
            <div key={rec.id} className="bg-parchment-ivory border border-ebony-deep/5 p-8 shadow-level-1 relative">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 border-b border-ebony-deep/5 pb-4">
                <div>
                  <span className="font-sans text-[9px] font-bold tracking-widest text-[#B35C44] uppercase bg-[#B35C44]/5 px-2.5 py-1">{lang === "fr" ? "Chambre Approuvée Geneva FreePort" : "Geneva FreePort Vetted Chamber"}</span>
                  <h4 className="font-serif text-lg font-medium mt-2 text-ebony-deep">{rec.artworkTitle}</h4>
                  <p className="font-sans text-xs text-zinc-400 flex items-center gap-1.5 mt-1"><Lock className="w-3.5 h-3.5 text-gold-leaf" /> {lang === "fr" ? "Code de Localisation" : "Location Code"}: <span className="font-mono text-zinc-500">{rec.vaultLocation}</span></p>
                </div>
                <div className="text-left md:text-right">
                  <span className="inline-flex px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-250/20 text-[9px] font-sans font-bold uppercase tracking-wider">{lang === "fr" ? "Standard Sécurisé" : "Secured Standard"}</span>
                  <p className="font-sans text-[11px] text-zinc-400 mt-1.5">{lang === "fr" ? "Dernière Inspection" : "Last Inspected"}: {rec.lastInspectionDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-low p-4 border border-ebony-deep/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-ebony-deep text-gold-leaf flex items-center justify-center"><Thermometer className="w-5 h-5 text-gold-leaf" /></div>
                  <div>
                    <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400">{lang === "fr" ? "Capteur de Microclimat" : "Microclimate Sensor"}</p>
                    <p className="font-sans text-xs text-ebony-deep font-semibold">{rec.temperatureHumidity}</p>
                    <p className="font-sans text-[10px] text-emerald-600 mt-0.5">{lang === "fr" ? "Delta Atmosphérique : Stable" : "Atmospheric Delta: Stable"}</p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-4 border border-ebony-deep/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-ebony-deep text-gold-leaf flex items-center justify-center"><Fingerprint className="w-5 h-5 text-gold-leaf" /></div>
                  <div>
                    <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400">{lang === "fr" ? "Étiquette Biométrique de Surface" : "Surface Biometric Tag"}</p>
                    <p className="font-mono text-xs text-ebony-deep font-semibold">{rec.fingerprintId}</p>
                    <p className="font-sans text-[10px] text-[#C5A059] mt-0.5">{lang === "fr" ? "Signature Vibratoire : Active" : "Vibration Signature: Active"}</p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-4 border border-ebony-deep/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-ebony-deep text-gold-leaf flex items-center justify-center"><Cpu className="w-5 h-5 text-gold-leaf" /></div>
                  <div>
                    <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400">{lang === "fr" ? "Contrat Intelligent du Registre" : "Ledger Smart Contract"}</p>
                    <p className="font-mono text-xs text-[#B35C44] font-semibold">{rec.smartContractAddress}</p>
                    <p className="font-sans text-[10px] text-zinc-400 mt-0.5">{lang === "fr" ? "Registre des Titres : V2 Vérifié" : "Deed Registry: V2 Verified"}</p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-4 border border-ebony-deep/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-ebony-deep text-gold-leaf flex items-center justify-center"><FileDigit className="w-5 h-5 text-gold-leaf" /></div>
                  <div>
                    <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400">{lang === "fr" ? "Contrat AXA Arts Fin" : "AXA Fine Art Contract"}</p>
                    <p className="font-mono text-xs text-ebony-deep font-semibold">{rec.insurancePolicyNumber}</p>
                    <p className="font-sans text-[10px] text-emerald-600 mt-0.5">{lang === "fr" ? "Couverture d'Indemnisation : Entièrement Autorisée" : "Indemnity Coverage: Fully Authorized"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-8 text-xs text-zinc-500 leading-relaxed font-sans">
          <div className="bg-parchment-ivory border border-ebony-deep/5 p-8 shadow-level-1 space-y-6">
            <h3 className="font-serif text-lg font-medium text-ebony-deep border-b border-gold-leaf/20 pb-4 flex items-center gap-2"><Activity className="w-4.5 h-4.5 text-gold-leaf" /> {lang === "fr" ? "Engagements d'Intégrité Cryptographique" : "Cryptographic Integrity Vows"}</h3>
            <p>{lang === "fr" ? "Le Registre Aduna utilise des mécanismes physiques et cryptographiques de grade militaire pour garantir que la séquence d'authenticité des antiquités anciennes reste intacte au fil des siècles de logistique." : "The Aduna Registry employs military-grade physical and cryptographic mechanisms to ensure the authenticity sequence of ancient antiquities remains untampered across centuries of logistics."}</p>
            <div className="bg-zinc-50 p-4 border border-ebony-deep/10 space-y-3">
              <p className="font-bold text-ebony-deep uppercase tracking-wider text-[10px] flex items-center gap-1"><HeartPulse className="w-3.5 h-3.5" /> {lang === "fr" ? "Journal d'Audit de Bio-Signature" : "Bio-Signature Audit Log"}</p>
              <p className="text-[11px] leading-relaxed">{lang === "fr" ? "Un scanner multi-spectral personnalisé déclenche périodiquement des journaux de micro-imagerie, scannant les configurations de grain de bois. Toute déviation génère des alarmes haute fréquence directes aux syndicats AXA." : "A custom multi-spectral scanner triggers micro-imaging logs periodically, scanning wood grain configurations. Any deviations generate direct high-vibe alarms to AXA syndicates instantly."}</p>
            </div>
            <p className="text-[11px]">{lang === "fr" ? "En liant des objets physiques personnalisés directement avec des contrats intelligents, les collectionneurs peuvent représenter ou échanger des titres absolus en toute sécurité via les systèmes de dépôt légal du Freeport suisse." : "By binding custom physical objects directly with smart contracts, collectors can represent or trade absolute deeds safely across Swiss freeport legal safe deposit systems."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
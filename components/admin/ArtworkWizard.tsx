"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslate } from "@/lib/translations";
import { adminApi } from "@/lib/api";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Palette,
  Ruler,
  DollarSign,
  ImageIcon,
  ScrollText,
  Settings,
  Loader2,
  Sparkles,
} from "lucide-react";

interface ArtworkWizardProps {
  artworkId?: string | null;
  onClose: () => void;
  onComplete: () => void;
}

const STEPS = [
  { key: "basic", icon: Palette, labelEn: "Basic Info", labelFr: "Infos de Base" },
  { key: "details", icon: Ruler, labelEn: "Art Details", labelFr: "Détails" },
  { key: "valuation", icon: DollarSign, labelEn: "Valuation", labelFr: "Évaluation" },
  { key: "media", icon: ImageIcon, labelEn: "Media", labelFr: "Média" },
  { key: "provenance", icon: ScrollText, labelEn: "Provenance", labelFr: "Provenance" },
  { key: "settings", icon: Settings, labelEn: "Settings", labelFr: "Paramètres" },
];

const emptyForm: Record<string, unknown> = {
  title: "",
  description: "",
  origin: "",
  region: "",
  tribe: "",
  era: "",
  historicalPeriod: "",
  material: "",
  dimensions: "",
  weight: "",
  condition: "",
  price: "",
  estimatedValue: "",
  isPOR: false,
  tier: "Standard",
  imageUrl: "",
  blurDataURL: "",
  scarcityIndex: 0,
  preservationStatus: "",
  appreciationRate: "",
  isHero: false,
  historicalStory: "",
  investmentThesis: "",
  artworkStatus: "Draft",
  acquiredYear: new Date().getFullYear(),
  acquiredMethod: "",
  provenanceChain: [] as string[],
  availability: "AVAILABLE",
};

export default function ArtworkWizard({ artworkId, onClose, onComplete }: ArtworkWizardProps) {
  const { lang } = useTranslate();
  const isEdit = !!artworkId;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Record<string, unknown>>({ ...emptyForm });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newProvenance, setNewProvenance] = useState("");

  useEffect(() => {
    if (isEdit && artworkId) {
      setLoading(true);
      adminApi.getArtworkById(artworkId).then((res) => {
        if (res.success) {
          const d = res.data;
          setForm({
            title: d.title || "",
            description: d.description || "",
            origin: d.origin || "",
            region: d.region || "",
            tribe: d.tribe || "",
            era: d.era || "",
            historicalPeriod: d.historicalPeriod || "",
            material: d.material || "",
            dimensions: d.dimensions || "",
            weight: d.weight || "",
            condition: d.condition || "",
            price: d.price || "",
            estimatedValue: d.estimatedValue || "",
            isPOR: d.isPOR || false,
            tier: d.tier || "Standard",
            imageUrl: d.imageUrl || "",
            blurDataURL: d.blurDataURL || "",
            scarcityIndex: d.scarcityIndex || 0,
            preservationStatus: d.preservationStatus || "",
            appreciationRate: d.appreciationRate || "",
            isHero: d.isHero || false,
            historicalStory: d.historicalStory || "",
            investmentThesis: d.investmentThesis || "",
            artworkStatus: d.artworkStatus || "Draft",
            acquiredYear: d.acquiredYear || new Date().getFullYear(),
            acquiredMethod: d.acquiredMethod || "",
            provenanceChain: d.provenanceChain || [],
            availability: d.availability || "AVAILABLE",
          });
        }
      }).finally(() => setLoading(false));
    }
  }, [artworkId, isEdit]);

  const update = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }));

  const addProvenance = () => {
    if (newProvenance.trim()) {
      update("provenanceChain", [...(form.provenanceChain as string[]), newProvenance.trim()]);
      setNewProvenance("");
    }
  };

  const removeProvenance = (idx: number) => {
    update("provenanceChain", (form.provenanceChain as string[]).filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!form.title) return;
    // Validate numeric fields
    if (form.price && isNaN(Number(form.price))) return;
    if (form.estimatedValue && isNaN(Number(form.estimatedValue))) return;
    setSaving(true);
    try {
      if (isEdit && artworkId) {
        await adminApi.updateArtwork(artworkId, form);
      } else {
        await adminApi.createArtwork(form);
      }
      onComplete();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const inputClass = "w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf transition-colors";
  const labelClass = "block text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider mb-1";

  const renderStep = () => {
    switch (STEPS[step].key) {
      case "basic":
        return (
          <motion.div key="basic" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div>
              <label className={labelClass}>{lang === "fr" ? "Titre" : "Title"} *</label>
              <input type="text" value={form.title as string} onChange={(e) => update("title", e.target.value)} className={inputClass} placeholder="Benin Bronze Relief Plaque" />
            </div>
            <div>
              <label className={labelClass}>{lang === "fr" ? "Description" : "Description"}</label>
              <textarea value={form.description as string} onChange={(e) => update("description", e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder={lang === "fr" ? "Description de l'œuvre..." : "Artwork description..."} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{lang === "fr" ? "Origine" : "Origin"} *</label>
                <input type="text" value={form.origin as string} onChange={(e) => update("origin", e.target.value)} className={inputClass} placeholder="Benin Kingdom" />
              </div>
              <div>
                <label className={labelClass}>{lang === "fr" ? "Région" : "Region"}</label>
                <input type="text" value={form.region as string} onChange={(e) => update("region", e.target.value)} className={inputClass} placeholder="West Africa" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{lang === "fr" ? "Tribu" : "Tribe"}</label>
                <input type="text" value={form.tribe as string} onChange={(e) => update("tribe", e.target.value)} className={inputClass} placeholder="Edo" />
              </div>
              <div>
                <label className={labelClass}>{lang === "fr" ? "Année acquise" : "Acquired Year"}</label>
                <input type="number" value={form.acquiredYear as number} onChange={(e) => update("acquiredYear", Number(e.target.value))} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>{lang === "fr" ? "Méthode d'acquisition" : "Acquisition Method"}</label>
              <input type="text" value={form.acquiredMethod as string} onChange={(e) => update("acquiredMethod", e.target.value)} className={inputClass} placeholder="Private Collection" />
            </div>
          </motion.div>
        );
      case "details":
        return (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{lang === "fr" ? "Époque" : "Era"}</label>
                <input type="text" value={form.era as string} onChange={(e) => update("era", e.target.value)} className={inputClass} placeholder="16th Century" />
              </div>
              <div>
                <label className={labelClass}>{lang === "fr" ? "Période historique" : "Historical Period"}</label>
                <input type="text" value={form.historicalPeriod as string} onChange={(e) => update("historicalPeriod", e.target.value)} className={inputClass} placeholder="Pre-Colonial" />
              </div>
            </div>
            <div>
              <label className={labelClass}>{lang === "fr" ? "Matériau" : "Material"} *</label>
              <input type="text" value={form.material as string} onChange={(e) => update("material", e.target.value)} className={inputClass} placeholder="Bronze, Wood, Terracotta..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{lang === "fr" ? "Dimensions" : "Dimensions"}</label>
                <input type="text" value={form.dimensions as string} onChange={(e) => update("dimensions", e.target.value)} className={inputClass} placeholder="45 × 30 × 12 cm" />
              </div>
              <div>
                <label className={labelClass}>{lang === "fr" ? "Poids" : "Weight"}</label>
                <input type="text" value={form.weight as string} onChange={(e) => update("weight", e.target.value)} className={inputClass} placeholder="3.2 kg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{lang === "fr" ? "État" : "Condition"}</label>
                <select value={form.condition as string} onChange={(e) => update("condition", e.target.value)} className={inputClass}>
                  <option value="">{lang === "fr" ? "Sélectionner..." : "Select..."}</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>{lang === "fr" ? "Disponibilité" : "Availability"}</label>
                <select value={form.availability as string} onChange={(e) => update("availability", e.target.value)} className={inputClass}>
                  <option value="AVAILABLE">{lang === "fr" ? "Disponible" : "Available"}</option>
                  <option value="RESERVED">{lang === "fr" ? "Réservé" : "Reserved"}</option>
                  <option value="SOLD">{lang === "fr" ? "Vendu" : "Sold"}</option>
                  <option value="ON_AUCTION">{lang === "fr" ? "En vente" : "On Auction"}</option>
                </select>
              </div>
            </div>
          </motion.div>
        );
      case "valuation":
        return (
          <motion.div key="valuation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gold-leaf/5 border border-gold-leaf/20">
              <Sparkles className="w-4 h-4 text-gold-leaf shrink-0" />
              <p className="text-[10px] font-sans text-on-surface-variant">{lang === "fr" ? "Définissez la valeur de l'œuvre pour les acheteurs potentiels" : "Set the artwork value for potential buyers"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{lang === "fr" ? "Prix (€)" : "Price (€)"}</label>
                <input type="number" value={form.price as string} onChange={(e) => update("price", e.target.value)} className={inputClass} placeholder="25000" />
              </div>
              <div>
                <label className={labelClass}>{lang === "fr" ? "Valeur estimée (€)" : "Estimated Value (€)"}</label>
                <input type="number" value={form.estimatedValue as string} onChange={(e) => update("estimatedValue", e.target.value)} className={inputClass} placeholder="35000" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isPOR" checked={form.isPOR as boolean} onChange={(e) => update("isPOR", e.target.checked)} className="accent-gold-leaf" />
              <label htmlFor="isPOR" className="text-xs font-sans text-ebony-deep">{lang === "fr" ? "Prix sur demande (POR)" : "Price on Request (POR)"}</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{lang === "fr" ? "Niveau" : "Tier"}</label>
                <select value={form.tier as string} onChange={(e) => update("tier", e.target.value)} className={inputClass}>
                  <option value="Standard">Standard</option>
                  <option value="Prestige">Prestige</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>{lang === "fr" ? "Taux d'appréciation (%)" : "Appreciation Rate (%)"}</label>
                <input type="number" step="0.1" value={form.appreciationRate as string} onChange={(e) => update("appreciationRate", e.target.value)} className={inputClass} placeholder="12.5" />
              </div>
            </div>
          </motion.div>
        );
      case "media":
        return (
          <motion.div key="media" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div>
              <label className={labelClass}>{lang === "fr" ? "URL de l'image" : "Image URL"}</label>
              <input type="url" value={form.imageUrl as string} onChange={(e) => update("imageUrl", e.target.value)} className={inputClass} placeholder="https://..." />
            </div>
            {(form.imageUrl as string) && (
              <div className="border border-outline-variant/30 p-2">
                <img src={form.imageUrl as string} alt="Preview" className="w-full h-48 object-cover" />
              </div>
            )}
            <div>
              <label className={labelClass}>{lang === "fr" ? "URL du flou (blurDataURL)" : "Blur Data URL"}</label>
              <input type="text" value={form.blurDataURL as string} onChange={(e) => update("blurDataURL", e.target.value)} className={inputClass} placeholder="data:image/jpeg;base64,..." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isHero" checked={form.isHero as boolean} onChange={(e) => update("isHero", e.target.checked)} className="accent-gold-leaf" />
              <label htmlFor="isHero" className="text-xs font-sans text-ebony-deep">{lang === "fr" ? "Afficher en vedette sur la page d'accueil" : "Feature on homepage hero slider"}</label>
            </div>
          </motion.div>
        );
      case "provenance":
        return (
          <motion.div key="provenance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div>
              <label className={labelClass}>{lang === "fr" ? "Chaîne de provenance" : "Provenance Chain"}</label>
              <div className="flex gap-2">
                <input type="text" value={newProvenance} onChange={(e) => setNewProvenance(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addProvenance()} className={`${inputClass} flex-1`} placeholder={lang === "fr" ? "Ajouter une entrée..." : "Add entry..."} />
                <button onClick={addProvenance} className="bg-ebony-deep text-parchment-ivory px-3 py-2 text-xs font-sans font-semibold cursor-pointer border-0 hover:opacity-90">{lang === "fr" ? "Ajouter" : "Add"}</button>
              </div>
              {(form.provenanceChain as string[]).length > 0 && (
                <div className="mt-2 space-y-1">
                  {(form.provenanceChain as string[]).map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-surface-container-low p-2 text-xs font-sans">
                      <span className="text-on-surface-variant/50 w-5">{idx + 1}.</span>
                      <span className="flex-1 text-ebony-deep">{entry}</span>
                      <button onClick={() => removeProvenance(idx)} className="text-red-500 hover:text-red-700 cursor-pointer border-0 bg-transparent text-xs">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>{lang === "fr" ? "Histoire historique" : "Historical Story"}</label>
              <textarea value={form.historicalStory as string} onChange={(e) => update("historicalStory", e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder={lang === "fr" ? "L'histoire et l'origine de l'œuvre..." : "The story and origin of this artwork..."} />
            </div>
            <div>
              <label className={labelClass}>{lang === "fr" ? "Thèse d'investissement" : "Investment Thesis"}</label>
              <textarea value={form.investmentThesis as string} onChange={(e) => update("investmentThesis", e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder={lang === "fr" ? "Pourquoi cette œuvre est un bon investissement..." : "Why this artwork is a good investment..."} />
            </div>
          </motion.div>
        );
      case "settings":
        return (
          <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{lang === "fr" ? "Statut" : "Status"}</label>
                <select value={form.artworkStatus as string} onChange={(e) => update("artworkStatus", e.target.value)} className={inputClass}>
                  <option value="Draft">Draft</option>
                  <option value="Live">Live</option>
                  <option value="Unpublished">Unpublished</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>{lang === "fr" ? "Indice de rareté" : "Scarcity Index"}</label>
                <input type="number" min="0" max="10" value={form.scarcityIndex as number} onChange={(e) => update("scarcityIndex", Number(e.target.value))} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>{lang === "fr" ? "État de conservation" : "Preservation Status"}</label>
              <input type="text" value={form.preservationStatus as string} onChange={(e) => update("preservationStatus", e.target.value)} className={inputClass} placeholder="Museum-grade, Climate-controlled..." />
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-xs z-50 flex items-center justify-center">
        <div className="bg-parchment-ivory p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-terracotta-earth animate-spin" />
          <p className="text-xs font-sans text-on-surface-variant">{lang === "fr" ? "Chargement..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-parchment-ivory border border-outline-variant/30 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
          <div>
            <h3 className="font-serif text-lg text-ebony-deep">{isEdit ? (lang === "fr" ? "Modifier l'Œuvre" : "Edit Artwork") : (lang === "fr" ? "Nouvelle Œuvre" : "New Artwork")}</h3>
            <p className="text-[10px] font-sans text-on-surface-variant mt-0.5">{lang === "fr" ? `Étape ${step + 1} sur ${STEPS.length}` : `Step ${step + 1} of ${STEPS.length}`}</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-ebony-deep cursor-pointer border-0 bg-transparent"><X className="w-5 h-5" /></button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isComplete = i < step;
              return (
                <div key={s.key} className="flex items-center flex-1">
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm transition-all ${isActive ? "bg-terracotta-earth/10" : isComplete ? "bg-emerald-50" : ""}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${isComplete ? "bg-emerald-500 text-white" : isActive ? "bg-terracotta-earth text-parchment-ivory" : "bg-outline-variant/30 text-on-surface-variant"}`}>
                      {isComplete ? <Check className="w-3 h-3" /> : i + 1}
                    </div>
                    <span className={`hidden lg:inline text-[9px] font-sans font-semibold uppercase tracking-wider ${isActive ? "text-terracotta-earth" : isComplete ? "text-emerald-600" : "text-on-surface-variant/50"}`}>
                      {lang === "fr" ? s.labelFr : s.labelEn}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && <div className="flex-1 h-px bg-outline-variant/30 mx-1" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 min-h-[300px]">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/30">
          <button onClick={prev} disabled={step === 0} className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider text-on-surface-variant hover:text-ebony-deep transition-colors cursor-pointer border-0 bg-transparent disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" /> {lang === "fr" ? "Retour" : "Back"}
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider text-on-surface-variant hover:text-ebony-deep transition-colors cursor-pointer border-0 bg-transparent">
              {lang === "fr" ? "Annuler" : "Cancel"}
            </button>
            {step === STEPS.length - 1 ? (
              <button onClick={handleSave} disabled={saving || !form.title} className="bg-ebony-deep text-parchment-ivory px-6 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer border-0 flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {isEdit ? (lang === "fr" ? "Enregistrer" : "Save") : (lang === "fr" ? "Créer l'Œuvre" : "Create Artwork")}
              </button>
            ) : (
              <button onClick={next} className="bg-ebony-deep text-parchment-ivory px-6 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer border-0 flex items-center gap-2">
                {lang === "fr" ? "Suivant" : "Next"} <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

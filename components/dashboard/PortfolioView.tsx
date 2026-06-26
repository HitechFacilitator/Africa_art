"use client";

import { useState, useEffect } from "react";
import { Acquisition, AcquisitionStatus } from "@/lib/dashboardTypes";
import { artworksApi, ArtworkData } from "@/lib/api";
import {
  Plus,
  Search,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Trash2,
  X,
  Sparkles,
  History,
  LockKeyhole
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslate } from "@/lib/translations";

interface PortfolioViewProps {
  acquisitions: Acquisition[];
  onAddAcquisition: (newAcq: Acquisition) => void;
  onRemoveAcquisition: (id: string) => void;
  selectedAcquisition: Acquisition | null;
  setSelectedAcquisition: (acq: Acquisition | null) => void;
}

export default function PortfolioView({
  acquisitions,
  onAddAcquisition,
  onRemoveAcquisition,
  selectedAcquisition,
  setSelectedAcquisition
}: PortfolioViewProps) {
  const { lang } = useTranslate();
  const [filter, setFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [customTitle, setCustomTitle] = useState('');
  const [customEra, setCustomEra] = useState('18th Century');
  const [customCulture, setCustomCulture] = useState('');
  const [customValue, setCustomValue] = useState('1500000');
  const [customStatus, setCustomStatus] = useState<AcquisitionStatus>(AcquisitionStatus.Certified);
  const [customDesc, setCustomDesc] = useState('');
  const [customProvenance, setCustomProvenance] = useState('');
  const [customImage, setCustomImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuBxXscArJs7jm8fkVlA0HIef3hG7nB9zqwOK7BCT6Qu4klQbMUWYQgZqPNbqpJRq-MwcmGhf4mmYLiUVINuSkXR8rBU8F1ZHRF8wchLVhgPk5iAS5xT3kjYy85IbKAaxp70n1aUl_n6zBrAIntKg2Sp49BQ_UhCYts4FHBnX2N1rN3ZdNIZQ5CPx1Y-T76d-vIAr0xDMJeZ_ubf0t8oewNFH_fr-mVjel_xdJ3NupPP1Ijd0IfN5O_AXdbDAUX428Enhm26KLL0Ew');
  const [artworkOptions, setArtworkOptions] = useState<Array<{ title: string; era: string; culture: string; value: number; imageUrl: string; description: string }>>([]);

  useEffect(() => {
    if (showAddModal && artworkOptions.length === 0) {
      artworksApi.getAll({ limit: 10 }).then(res => {
        setArtworkOptions(res.data.map((a: ArtworkData) => ({
          title: a.title,
          era: a.era || a.period || "",
          culture: a.region || a.origin || "",
          value: typeof a.investment?.estimatedValue === 'number' ? a.investment.estimatedValue : typeof a.label === 'number' ? a.label : 0,
          imageUrl: a.imageUrl || "",
          description: a.historicalStory || "",
        })));
      }).catch(() => {});
    }
  }, [showAddModal]);

  const filteredAcquisitions = acquisitions.filter(item => {
    const matchesFilter = filter === 'ALL' || (filter === 'CERTIFIED' && item.status === AcquisitionStatus.Certified) || (filter === 'TRANSIT' && item.status === AcquisitionStatus.InTransit) || (filter === 'PENDING' && item.status === AcquisitionStatus.Pending);
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.culture.toLowerCase().includes(searchQuery.toLowerCase()) || item.era.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSelectPreset = (preset: typeof artworkOptions[0]) => {
    setCustomTitle(preset.title);
    setCustomEra(preset.era);
    setCustomCulture(preset.culture);
    setCustomValue(preset.value.toString());
    setCustomImage(preset.imageUrl);
    setCustomDesc(preset.description);
    setCustomProvenance(`Royal Treasury Office, source archaeological vetting.\nAduna Registry authentication certified.`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customCulture) return;
    const parsedProvenance = customProvenance ? customProvenance.split('\n').filter(line => line.trim() !== '') : ['Historical provenance registered.', `Added to Julian Doe cabinet on ${new Date().toLocaleDateString()}`];
    const newAcquisition: Acquisition = {
      id: `acq_${Date.now()}`,
      title: customTitle,
      era: customEra,
      culture: customCulture,
      acquisitionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: customStatus,
      imageUrl: customImage,
      estimatedValueEur: Number(customValue) || 1200000,
      description: customDesc || 'No formal description, provenance documentation active.',
      provenance: [`Vetted source location (${customEra})`, ...parsedProvenance, `Vetted by Aduna Labs Vetting Advisory Committee`, `Acquired by Julian Doe (${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`]
    };
    onAddAcquisition(newAcquisition);
    setShowAddModal(false);
    setCustomTitle('');
    setCustomCulture('');
    setCustomValue('1500000');
    setCustomDesc('');
    setCustomProvenance('');
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="animate-fade-in relative">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-ebony-deep/10">
        <div>
          <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Le Cabinet du Collectionneur" : "The Collector's Cabinet"}</h2>
          <p className="font-sans text-xs text-on-surface-variant mt-1">Manage your authenticated cultural artifacts, verify ledger records, and coordinate physical private museum delivery.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-6 py-3.5 hover:opacity-90 active:scale-98 transition-all flex items-center gap-2 cursor-pointer border-0">
          <Plus className="w-4.5 h-4.5" /> {lang === "fr" ? "Enregistrer une Nouvelle Acquisition" : "Register New Acquisition"}
        </button>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8">
        <div className="flex bg-surface-container/60 border border-ebony-deep/5 p-1 self-start select-none">
          {['ALL', 'CERTIFIED', 'TRANSIT', 'PENDING'].map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)} className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer ${filter === tab ? 'bg-ebony-deep text-parchment-ivory' : 'text-zinc-400 hover:text-ebony-deep'}`}>
              {tab === 'ALL' && (lang === "fr" ? "Tous" : 'All')}{tab === 'CERTIFIED' && (lang === "fr" ? "Certifié" : 'Certified')}{tab === 'TRANSIT' && (lang === "fr" ? "En Transit" : 'In Transit')}{tab === 'PENDING' && (lang === "fr" ? "En Attente" : 'Pending')}
            </button>
          ))}
        </div>
        <div className="relative flex items-center min-w-0 flex-1 sm:flex-initial sm:w-60">
          <Search className="absolute left-3.5 w-4 h-4 text-zinc-400" />
          <input type="text" placeholder={lang === "fr" ? "Rechercher des artefacts..." : "Search artifacts..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-parchment-ivory border border-ebony-deep/10 pl-10 pr-4 py-2.5 text-xs font-sans tracking-wide text-ebony-deep focus:outline-none focus:border-gold-leaf" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {filteredAcquisitions.length === 0 ? (
            <div className="bg-parchment-ivory border border-dashed border-ebony-deep/10 p-12 text-center select-none">
              <ShieldAlert className="w-10 h-10 text-gold-leaf mx-auto mb-4" />
              <p className="font-serif text-lg text-ebony-deep">{lang === "fr" ? "Aucun Artefact Trouvé" : "No Artifacts Found"}</p>
              <p className="font-sans text-xs text-zinc-400 max-w-sm mx-auto mt-1">Refine your filter query or register a new museum verification item using the action panel above.</p>
            </div>
          ) : (
            filteredAcquisitions.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div key={item.id} onClick={() => setSelectedAcquisition(item)} className={`bg-parchment-ivory border ${selectedAcquisition?.id === item.id ? 'border-gold-leaf ring-1 ring-gold-leaf/20' : 'border-ebony-deep/5'} shadow-level-1 transition-all cursor-pointer p-6 flex flex-col sm:flex-row gap-6 relative group`}>
                  {item.id.startsWith('acq_17') && (
                    <button onClick={(e) => { e.stopPropagation(); onRemoveAcquisition(item.id); if (selectedAcquisition?.id === item.id) setSelectedAcquisition(null); }} title="Deregister item" className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 z-10 p-1 bg-surface-container-low hover:scale-105 transition-transform border border-ebony-deep/5">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="w-full sm:w-32 h-32 bg-surface-container-highest shrink-0 relative overflow-hidden border border-ebony-deep/5">
                    <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <h4 className="font-serif text-lg text-ebony-deep group-hover:text-gold-leaf transition-colors leading-tight">{item.title}</h4>
                          <p className="font-sans text-xs text-on-surface-variant">{item.era} • {item.culture}</p>
                        </div>
                        <span className={`font-sans text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 border ${item.status === 'Certified' ? 'bg-emerald-50 text-emerald-800 border-emerald-250/30' : item.status === 'In Transit' ? 'bg-amber-50 text-amber-800 border-amber-250/30' : 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>{item.status}</span>
                      </div>
                      <p className="font-sans text-xs text-zinc-500 line-clamp-2 pr-6 leading-relaxed mb-4">{item.description}</p>
                    </div>
                    <div className="flex justify-between items-end border-t border-ebony-deep/5 pt-3">
                      <div>
                        <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400">{lang === "fr" ? "Valeur Estimée du Conseiller" : "Estimated Advisor Value"}</p>
                        <p className="font-serif text-base text-gold-leaf font-medium">€{item.estimatedValueEur.toLocaleString()}</p>
                      </div>
                      <button onClick={(e) => toggleExpand(item.id, e)} className="font-sans text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-ebony-deep transition-all flex items-center gap-1 cursor-pointer">
                        {isExpanded ? (<>{lang === "fr" ? "Masquer la Provenance" : "Hide Provenance"} <ChevronUp className="w-3.5 h-3.5" /></>) : (<>{lang === "fr" ? "Afficher la Provenance" : "Show Provenance"} <ChevronDown className="w-3.5 h-3.5" /></>)}
                      </button>
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4 pt-4 border-t border-ebony-deep/5">
                          <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-terracotta-earth mb-3 flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Checked Chronology & Pedigree</p>
                          <div className="pl-4 border-l border-gold-leaf/20 flex flex-col gap-2">
                            {item.provenance.map((prov, idx) => (
                              <div key={idx} className="relative flex items-start gap-3">
                                <div className="absolute left-[-21px] top-[5px] w-2 h-2 rounded-full bg-gold-leaf ring-4 ring-parchment-ivory" />
                                <p className="font-sans text-[11px] text-zinc-500 italic pr-4 leading-normal">{prov}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-parchment-ivory p-8 border border-ebony-deep/5 shadow-level-1 sticky top-24">
            <h3 className="font-serif text-lg font-medium text-ebony-deep border-b border-gold-leaf/20 pb-4 mb-6 flex items-center gap-2">
              <LockKeyhole className="w-4 h-4 text-gold-leaf" /> {lang === "fr" ? "Certificat de Provenance" : "Provenance Certificate"}
            </h3>
            {selectedAcquisition ? (
              <div className="text-on-surface">
                <div className="aspect-[4/3] w-full bg-surface-container-highest overflow-hidden mb-6 border border-ebony-deep/5">
                  <img src={selectedAcquisition.imageUrl} alt={selectedAcquisition.title} referrerPolicy="no-referrer" className="w-full h-full object-cover object-center" />
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[9px] font-bold tracking-widest uppercase bg-terracotta-earth/10 text-terracotta-earth px-2 py-0.5">{lang === "fr" ? "Dossier Patrimonial" : "Heritage File"}</span>
                    <span className="font-mono text-[10px] text-zinc-400">ID: {selectedAcquisition.id.toUpperCase()}</span>
                  </div>
                  <h4 className="font-serif text-xl font-medium mt-2 text-ebony-deep">{selectedAcquisition.title}</h4>
                  <p className="font-sans text-xs text-zinc-500 mt-1">Origin: {selectedAcquisition.culture} ({selectedAcquisition.era})</p>
                </div>
                <div className="border-l-4 border-l-terracotta-earth bg-surface-container-low p-4 mb-6">
                  <p className="font-sans text-xs uppercase font-bold tracking-widest text-zinc-400 mb-1">{lang === "fr" ? "Note Officielle du Conservateur" : "Official Curator Note"}</p>
                  <p className="font-sans text-xs text-zinc-500 leading-relaxed italic">&quot;{selectedAcquisition.description}&quot;</p>
                </div>
                <div className="space-y-3 pb-6 border-b border-ebony-deep/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">{lang === "fr" ? "État de l'Évaluation" : "Valuation Status"}</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">{lang === "fr" ? "Placement Privé Vérifié" : "Vetted Private Placement"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Current Valuation</span>
                    <span className="font-mono font-medium text-gold-leaf">€{selectedAcquisition.estimatedValueEur.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">{lang === "fr" ? "Coffre-Fort Sécurisé" : "Secure Safe Vault"}</span>
                    <span className="text-ebony-deep font-sans font-medium">Geneva Chamber IV</span>
                  </div>
                </div>
                <button onClick={() => {
                  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Ledger Proof - ${selectedAcquisition.title}</title><style>
                    body{font-family:Georgia,serif;color:#0f0f0f;max-width:800px;margin:40px auto;padding:40px;border:2px double #C5A059}
                    h1{font-size:22px;text-align:center;text-transform:uppercase;letter-spacing:3px;margin-bottom:6px}
                    h2{font-size:11px;text-align:center;color:#785a1a;text-transform:uppercase;letter-spacing:5px;margin-bottom:30px}
                    .meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;padding:16px 0;font-size:12px}
                    .meta span{display:block;font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#888;margin-bottom:2px}
                    .meta strong{color:#0f0f0f}
                    .provenance{margin:20px 0;font-size:12px;line-height:1.8}
                    .provenance li{margin-bottom:6px}
                    .footer{text-align:center;font-size:9px;color:#aaa;margin-top:40px;letter-spacing:2px;text-transform:uppercase}
                    @media print{body{border:none;margin:0;padding:20px}}
                  </style></head><body>
                    <img src="/logo.png" style="width:60px;height:60px;display:block;margin:0 auto 8px" alt="Aduna Gallery" />
                    <h1>Down-stream Ledger Proof</h1>
                    <h2>Aduna Gallery — Provenance Registry Certificate</h2>
                    <div class="meta">
                      <div><span>Acquisition ID</span><strong>${selectedAcquisition.id}</strong></div>
                      <div><span>Title</span><strong>${selectedAcquisition.title}</strong></div>
                      <div><span>Era</span><strong>${selectedAcquisition.era}</strong></div>
                      <div><span>Culture</span><strong>${selectedAcquisition.culture}</strong></div>
                      <div><span>Estimated Value</span><strong>€${selectedAcquisition.estimatedValueEur.toLocaleString()}</strong></div>
                      <div><span>Status</span><strong>${selectedAcquisition.status}</strong></div>
                      <div><span>Acquisition Date</span><strong>${selectedAcquisition.acquisitionDate}</strong></div>
                      <div><span>Custody Location</span><strong>Geneva Chamber IV — Freeport Vault</strong></div>
                    </div>
                    <h3 style="font-size:14px;margin:20px 0 8px;border-bottom:1px solid #e5e5e5;padding-bottom:6px">Provenance Chain of Custody</h3>
                    <ol class="provenance">${selectedAcquisition.provenance.map(p => `<li>${p}</li>`).join("")}</ol>
                    <div style="margin-top:24px;padding:16px;border-left:3px solid #C5A059;font-size:11px;line-height:1.6;color:#555">
                      <strong>Certification:</strong> This ledger proof certifies the provenance chain and custody status of the above artifact as recorded in the Aduna Gallery institutional registry. All blockchain-anchored records are immutable and verifiable.
                    </div>
                    <div class="footer">Aduna Gallery — Down-stream Ledger Proof — ${new Date().toISOString().split("T")[0]}</div>
                  </body></html>`;
                  const w = window.open("", "_blank");
                  if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500); }
                }} className="w-full mt-6 bg-ebony-deep text-parchment-ivory font-sans text-xs font-bold uppercase tracking-widest py-3.5 hover:opacity-90 transition-all cursor-pointer">
                  {lang === "fr" ? "Preuve de Registre en Aval" : "Down-stream Ledger Proof"}
                </button>
              </div>
            ) : (
              <div className="text-center py-16 text-zinc-400">
                <p className="font-serif italic text-sm mb-2">No artifact spotlighted</p>
                <p className="font-sans text-xs text-zinc-500">Select any acquisition in your ledger catalog to visualize historical coordinates and private registry deeds.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-parchment-ivory border border-gold-leaf w-full max-w-3xl max-h-[90vh] overflow-y-auto text-ebony-deep">
              <div className="px-8 py-5 border-b border-gold-leaf/20 bg-ebony-deep text-gold-leaf flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-leaf" />
                  <h3 className="font-serif text-lg font-medium tracking-wide uppercase">Aduna Heritage Secure Registration</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-gold-leaf hover:text-parchment-ivory cursor-pointer focus:outline-none"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-8">
                <div className="mb-8">
                  <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-3">Select A Vetted Masterpiece From Curator Register</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {artworkOptions.map((opt, idx) => (
                      <div key={idx} onClick={() => handleSelectPreset(opt)} className="bg-surface border border-ebony-deep/5 hover:border-gold-leaf p-3 cursor-pointer text-left transition-colors group flex items-start gap-3">
                        <div className="w-12 h-12 bg-zinc-200 shrink-0 overflow-hidden"><img src={opt.imageUrl} alt={opt.title} referrerPolicy="no-referrer" className="w-full h-full object-cover object-center" /></div>
                        <div>
                          <h5 className="font-serif text-xs font-semibold text-ebony-deep line-clamp-1">{opt.title}</h5>
                          <p className="font-sans text-[9px] text-zinc-400 mt-0.5">Value: €{(opt.value / 1000000).toFixed(1)}M</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 border-b border-ebony-deep/5 pb-2">Or Enter Custom Acquisition Parameters</p>
                  <p className="font-sans text-[10px] text-on-surface-variant/60">{lang === "fr" ? "Les acquisitions ajoutées persistant pendant cette session uniquement." : "Added acquisitions persist for this session only."}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5 flex items-center gap-1">{lang === "fr" ? "Titre de l'Artefact" : "Artifact Title"} <span className="text-red-500">*</span></label>
                      <input type="text" required placeholder="e.g. Benin King Scepter" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} className="bg-white border border-ebony-deep/15 focus:border-gold-leaf p-3 text-xs focus:outline-none" />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5 flex items-center gap-1">{lang === "fr" ? "Tribu / Culture d'Origine" : "Originating Tribe / Culture"} <span className="text-red-500">*</span></label>
                      <input type="text" required placeholder="e.g. Nok Culture" value={customCulture} onChange={(e) => setCustomCulture(e.target.value)} className="bg-white border border-ebony-deep/15 focus:border-gold-leaf p-3 text-xs focus:outline-none" />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5">{lang === "fr" ? "Ère et Période" : "Era & Period"}</label>
                      <select value={customEra} onChange={(e) => setCustomEra(e.target.value)} className="bg-white border border-ebony-deep/15 focus:border-gold-leaf p-3 text-xs focus:outline-none">
                        <option value="500 BC - 200 AD">500 BC - 200 AD</option>
                        <option value="12th–15th Century">12th–15th Century</option>
                        <option value="16th Century">16th Century</option>
                        <option value="18th Century">18th Century</option>
                        <option value="19th Century">19th Century</option>
                        <option value="Contemporary (2020s)">Contemporary (2020s)</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5 flex items-center gap-1">{lang === "fr" ? "Évaluation Officielle" : "Official Valuation"} (EUR €) <span className="text-red-500">*</span></label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-zinc-400 text-xs font-semibold">€</span>
                        <input type="number" required value={customValue} onChange={(e) => setCustomValue(e.target.value)} className="w-full bg-white border border-ebony-deep/15 focus:border-gold-leaf pl-8 pr-4 py-3 text-xs focus:outline-none" />
                      </div>
                    </div>
                    <div className="flex flex-col md:col-span-2">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5">Historical Artwork High-Res Reference Image</label>
                      <input type="url" placeholder="Image URL" value={customImage} onChange={(e) => setCustomImage(e.target.value)} className="bg-white border border-ebony-deep/15 focus:border-gold-leaf p-3 text-xs focus:outline-none" />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5">Aduna Registry Initial Status</label>
                      <div className="flex gap-4">
                        {[AcquisitionStatus.Certified, AcquisitionStatus.InTransit, AcquisitionStatus.Pending].map((st) => (
                          <label key={st} className="flex items-center gap-2 text-xs font-sans text-ebony-deep cursor-pointer">
                            <input type="radio" name="curation_status" value={st} checked={customStatus === st} onChange={() => setCustomStatus(st)} className="text-ebony-deep focus:ring-gold-leaf" />{st}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col md:col-span-2">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5">Curatorial Description Detail</label>
                      <textarea rows={3} placeholder="Provide details about stylistic composition, materials used, conservation requirements..." value={customDesc} onChange={(e) => setCustomDesc(e.target.value)} className="bg-white border border-ebony-deep/15 focus:border-gold-leaf p-3 text-xs focus:outline-none" />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5">Deed Ownership Chronicles (Enter one location/event per line)</label>
                      <textarea rows={3} placeholder={"e.g. Royal Palace Court Treasury (1720)\nSotheby's Auction Zurich (1956)"} value={customProvenance} onChange={(e) => setCustomProvenance(e.target.value)} className="bg-white border border-ebony-deep/15 focus:border-gold-leaf p-3 text-xs focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 pt-6 border-t border-ebony-deep/5">
                    <button type="button" onClick={() => setShowAddModal(false)} className="bg-transparent border border-ebony-deep/20 px-6 py-3 text-xs font-sans font-bold uppercase tracking-widest text-zinc-500 hover:text-ebony-deep">{lang === "fr" ? "Passer" : "Bypass"}</button>
                    <button type="submit" className="bg-ebony-deep text-parchment-ivory px-8 py-3 text-xs font-sans font-bold uppercase tracking-widest hover:opacity-90 active:scale-98 transition-all">{lang === "fr" ? "Certifier le Registre en Sécurité" : "Certify Ledger Securely"}</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
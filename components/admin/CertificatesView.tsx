"use client";

import { useState, useRef, useEffect } from "react";
import { AdminCertificate } from "@/lib/adminTypes";
import { useTranslate } from "@/lib/translations";
import {
  Search,
  Plus,
  Award,
  MoreVertical,
  Ban,
  Copy,
  Pencil,
  Trash2,
  X,
  Upload,
  Download,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import SmartDropdown from "@/components/ui/SmartDropdown";

interface ArtworkOption {
  id: string;
  title: string;
  culture: string;
  era: string;
}

interface CertificatesViewProps {
  certificates: AdminCertificate[];
  onCreate: (cert: AdminCertificate) => void;
  onUpdate: (id: string, data: Partial<AdminCertificate>) => void;
  onRevoke: (id: string) => void;
  onDelete: (id: string) => void;
}

const emptyForm = {
  artworkTitle: "",
  artworkId: "",
  ownerName: "",
  ownerEmail: "",
  expiryDate: "",
  verifiedBy: "Aduna Gallery",
  description: "",
  authenticationLevel: "Standard",
  pdfFileName: "",
};

export default function CertificatesView({ certificates, onCreate, onUpdate, onRevoke, onDelete }: CertificatesViewProps) {
  const { lang } = useTranslate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCert, setEditingCert] = useState<AdminCertificate | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [artworks, setArtworks] = useState<ArtworkOption[]>([]);

  useEffect(() => {
    adminApi.getArtworks({ limit: 100 }).then(res => {
      setArtworks(res.data.map(a => ({ id: a.id, title: a.title, culture: a.culture, era: a.era })));
    }).catch(() => {});
  }, []);

  const filtered = certificates.filter((c) => {
    const matchesSearch =
      c.artworkTitle.toLowerCase().includes(search.toLowerCase()) ||
      c.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Valid: "bg-emerald-100 text-emerald-800",
      Expired: "bg-amber-100 text-amber-800",
      Revoked: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  const copyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const numericArtworkId = form.artworkId ? Number(form.artworkId.replace(/^ART-/i, "")) : undefined;
      await adminApi.createCertificate({
        artworkTitle: form.artworkTitle,
        artworkId: numericArtworkId ? String(numericArtworkId) : undefined,
        ownerName: form.ownerName,
        ownerEmail: form.ownerEmail,
        expiryDate: form.expiryDate || undefined,
        verifiedBy: form.verifiedBy || "Aduna Gallery",
        file: pdfFile || undefined,
      });
      setForm(emptyForm);
      setPdfFile(null);
      setShowCreateModal(false);
      onCreate(undefined as unknown as AdminCertificate);
    } catch (err) {
      console.error("Create certificate failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingCert) return;
    setSaving(true);
    try {
      await adminApi.updateCertificate(editingCert.id, {
        artworkTitle: form.artworkTitle || editingCert.artworkTitle,
        ownerName: form.ownerName || editingCert.ownerName,
        ownerEmail: form.ownerEmail || editingCert.ownerEmail,
        expiryDate: form.expiryDate || editingCert.expiryDate,
        verifiedBy: form.verifiedBy || editingCert.verifiedBy,
      });
      onUpdate(editingCert.id, {
        artworkTitle: form.artworkTitle || editingCert.artworkTitle,
        ownerName: form.ownerName || editingCert.ownerName,
        ownerEmail: form.ownerEmail || editingCert.ownerEmail,
        expiryDate: form.expiryDate || editingCert.expiryDate,
        verifiedBy: form.verifiedBy || editingCert.verifiedBy,
      });
      setEditingCert(null);
      setForm(emptyForm);
    } catch (err) {
      console.error("Update certificate failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (cert: AdminCertificate) => {
    setEditingCert(cert);
    setForm({
      artworkTitle: cert.artworkTitle,
      artworkId: cert.artworkId,
      ownerName: cert.ownerName,
      ownerEmail: cert.ownerEmail,
      expiryDate: cert.expiryDate === "N/A" ? "" : cert.expiryDate,
      verifiedBy: cert.verifiedBy,
      description: "",
      authenticationLevel: "Standard",
      pdfFileName: "",
    });
    setOpenMenuId(null);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingCert(null);
    setForm(emptyForm);
    setPdfFile(null);
  };

  const isModalOpen = showCreateModal || editingCert !== null;
  const modalTitle = editingCert
    ? (lang === "fr" ? "Modifier le Certificat" : "Edit Certificate")
    : (lang === "fr" ? "Créer un Certificat" : "Create Certificate");
  const modalSubmitLabel = editingCert
    ? (lang === "fr" ? "Enregistrer" : "Save")
    : (lang === "fr" ? "Créer" : "Create");

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="font-serif text-2xl font-medium text-ebony-deep">
          {lang === "fr" ? "Gestion des Certificats" : "Certificate Management"}
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant/50" />
            <input type="text" placeholder={lang === "fr" ? "Rechercher..." : "Search..."} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-56 bg-surface-container-lowest border border-outline-variant/30 pl-9 pr-3 py-2 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-surface-container-lowest border border-outline-variant/30 px-3 py-2 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf cursor-pointer">
            <option value="all">{lang === "fr" ? "Tous les statuts" : "All statuses"}</option>
            <option value="Valid">{lang === "fr" ? "Valide" : "Valid"}</option>
            <option value="Expired">{lang === "fr" ? "Expiré" : "Expired"}</option>
            <option value="Revoked">{lang === "fr" ? "Révoqué" : "Revoked"}</option>
          </select>
          <button onClick={() => { setForm(emptyForm); setShowCreateModal(true); }} className="bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-wider px-4 py-2 hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer border-0">
            <Plus className="w-4 h-4" /> {lang === "fr" ? "Créer" : "Create"}
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans">
            <thead>
              <tr className="border-b border-outline-variant/30 text-[10px] uppercase tracking-wider text-on-surface-variant">
                <th className="text-left px-4 py-3 font-semibold">{lang === "fr" ? "Certificat" : "Certificate"}</th>
                <th className="text-left px-4 py-3 font-semibold">{lang === "fr" ? "Œuvre" : "Artwork"}</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">{lang === "fr" ? "Propriétaire" : "Owner"}</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">{lang === "fr" ? "Émis" : "Issued"}</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">{lang === "fr" ? "Expire" : "Expires"}</th>
                <th className="text-left px-4 py-3 font-semibold">{lang === "fr" ? "Statut" : "Status"}</th>
                <th className="text-right px-4 py-3 font-semibold">{lang === "fr" ? "Actions" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cert) => (
                <tr key={cert.id} className="border-b border-outline-variant/10 hover:bg-surface-container/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gold-leaf shrink-0" />
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] text-on-surface-variant truncate">{cert.id}</p>
                        <p className="text-on-surface-variant/60 text-[10px]">{cert.verifiedBy}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ebony-deep truncate max-w-[150px]">{cert.artworkTitle}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-on-surface-variant truncate max-w-[120px]">{cert.ownerName}</p>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant hidden lg:table-cell">{cert.issuedDate}</td>
                  <td className="px-4 py-3 text-on-surface-variant hidden lg:table-cell">{cert.expiryDate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBadge(cert.status)}`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => copyHash(cert.blockchainHash, cert.id)} className="p-1.5 text-ebony-deep/60 hover:text-gold-leaf transition-colors cursor-pointer border-0 bg-transparent" title={lang === "fr" ? "Copier le hash" : "Copy hash"}>
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <SmartDropdown
                        open={openMenuId === cert.id}
                        onClose={() => setOpenMenuId(null)}
                        trigger={
                          <button onClick={() => setOpenMenuId(openMenuId === cert.id ? null : cert.id)} className="p-1.5 text-ebony-deep/60 hover:text-ebony-deep transition-colors cursor-pointer border-0 bg-transparent">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        }
                      >
                          <button onClick={async () => {
                            try {
                              const blob = await adminApi.downloadCertificatePdf(cert.id);
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `${cert.artworkTitle.replace(/[^a-zA-Z0-9]/g, "_")}_certificate.pdf`;
                              a.click();
                              URL.revokeObjectURL(url);
                            } catch (err) {
                              console.error("PDF download failed:", err);
                            }
                            setOpenMenuId(null);
                          }} className="w-full text-left px-4 py-2.5 text-xs font-sans flex items-center gap-2 hover:bg-surface-container/40 text-ebony-deep cursor-pointer border-0 bg-transparent">
                            <Download className="w-3.5 h-3.5" /> {lang === "fr" ? "Télécharger PDF" : "Download PDF"}
                          </button>
                          <button onClick={() => openEditModal(cert)} className="w-full text-left px-4 py-2.5 text-xs font-sans flex items-center gap-2 hover:bg-surface-container/40 text-ebony-deep cursor-pointer border-0 bg-transparent">
                            <Pencil className="w-3.5 h-3.5" /> {lang === "fr" ? "Modifier" : "Edit"}
                          </button>
                          <button onClick={() => { if (confirm(lang === "fr" ? `Supprimer le certificat ${cert.id} ? Cette action est irréversible.` : `Delete certificate ${cert.id}? This cannot be undone.`)) { onDelete(cert.id); setOpenMenuId(null); } }} className="w-full text-left px-4 py-2.5 text-xs font-sans flex items-center gap-2 hover:bg-surface-container/40 text-red-700 cursor-pointer border-0 bg-transparent">
                            <Trash2 className="w-3.5 h-3.5" /> {lang === "fr" ? "Supprimer" : "Delete"}
                          </button>
                      </SmartDropdown>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-on-surface-variant/50">
                    {lang === "fr" ? "Aucun certificat trouvé" : "No certificates found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center text-[10px] text-on-surface-variant/50 font-sans">
        <span>{filtered.length} {lang === "fr" ? "certificats" : "certificates"}</span>
        <span>{lang === "fr" ? "Total: " : "Total: "}{certificates.length} {lang === "fr" ? "certificats" : "certificates"}</span>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-parchment-ivory border border-outline-variant/30 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 px-6 pt-6">
              <h3 className="font-serif text-xl text-ebony-deep">{modalTitle}</h3>
              <button onClick={closeModal} className="text-on-surface-variant hover:text-ebony-deep cursor-pointer border-0 bg-transparent"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4 px-6">
              <div>
                <label className="block text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider mb-1">{lang === "fr" ? "Œuvre" : "Artwork"} *</label>
                <select
                  value={form.artworkId}
                  onChange={(e) => {
                    const selected = artworks.find(a => a.id === e.target.value);
                    setForm({
                      ...form,
                      artworkId: e.target.value,
                      artworkTitle: selected?.title || form.artworkTitle,
                    });
                  }}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf cursor-pointer"
                >
                  <option value="">{lang === "fr" ? "— Sélectionner une œuvre —" : "— Select an artwork —"}</option>
                  {artworks.map(a => (
                    <option key={a.id} value={a.id}>{a.title} ({a.id})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider mb-1">{lang === "fr" ? "Titre de l'Œuvre" : "Artwork Title"} *</label>
                <input type="text" value={form.artworkTitle} onChange={(e) => setForm({ ...form, artworkTitle: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf" placeholder="Benin Bronze Relief Plaque" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider mb-1">{lang === "fr" ? "Propriétaire" : "Owner"} *</label>
                  <input type="text" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf" placeholder="Collector Name" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider mb-1">{lang === "fr" ? "E-mail" : "Email"}</label>
                  <input type="email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf" placeholder="collector@example.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider mb-1">{lang === "fr" ? "Date d'expiration" : "Expiry Date"}</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider mb-1">{lang === "fr" ? "Niveau d'Authentification" : "Authentication Level"}</label>
                  <select value={form.authenticationLevel} onChange={(e) => setForm({ ...form, authenticationLevel: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf cursor-pointer">
                    <option value="Standard">Standard</option>
                    <option value="Enhanced">Enhanced</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider mb-1">{lang === "fr" ? "Certifié par" : "Verified By"}</label>
                <input type="text" value={form.verifiedBy} onChange={(e) => setForm({ ...form, verifiedBy: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf" placeholder="Aduna Gallery" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider mb-1">{lang === "fr" ? "Description" : "Description"}</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf resize-none" placeholder={lang === "fr" ? "Détails supplémentaires sur le certificat..." : "Additional certificate details..."} />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider mb-1">{lang === "fr" ? "PDF du Certificat" : "Certificate PDF"}</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 text-xs font-sans text-on-surface-variant hover:text-ebony-deep hover:border-gold-leaf transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>{form.pdfFileName || (lang === "fr" ? "Choisir un fichier..." : "Choose file...")}</span>
                  </button>
                  <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setForm({ ...form, pdfFileName: file.name });
                    if (file) setPdfFile(file);
                  }} />
                  {form.pdfFileName && (
                    <button type="button" onClick={() => setForm({ ...form, pdfFileName: "" })} className="text-on-surface-variant/50 hover:text-red-600 transition-colors cursor-pointer border-0 bg-transparent">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-on-surface-variant/50 mt-1">
                  {lang === "fr" ? "PDF facultatif — sera joint au certificat" : "Optional — will be attached to the certificate"}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 px-6 pb-6 pt-4 border-t border-outline-variant/30">
              <button onClick={closeModal} className="px-4 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider text-on-surface-variant hover:text-ebony-deep transition-colors cursor-pointer border-0 bg-transparent">{lang === "fr" ? "Annuler" : "Cancel"}</button>
              <button onClick={editingCert ? handleUpdate : handleCreate} disabled={!form.artworkTitle || !form.ownerName || saving} className="bg-ebony-deep text-parchment-ivory px-6 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer border-0">{saving ? "..." : modalSubmitLabel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

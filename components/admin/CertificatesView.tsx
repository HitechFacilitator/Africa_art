"use client";

import { useState } from "react";
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
} from "lucide-react";

interface CertificatesViewProps {
  certificates: AdminCertificate[];
  onCreate: (cert: AdminCertificate) => void;
  onUpdate: (id: string, data: Partial<AdminCertificate>) => void;
  onRevoke: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CertificatesView({ certificates, onCreate, onUpdate, onRevoke, onDelete }: CertificatesViewProps) {
  const { lang } = useTranslate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCert, setEditingCert] = useState<AdminCertificate | null>(null);
  const [form, setForm] = useState({ artworkTitle: "", artworkId: "", ownerName: "", ownerEmail: "", expiryDate: "", verifiedBy: "Aduna Gallery" });

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

  const handleCreate = () => {
    const newCert: AdminCertificate = {
      id: `cert-${Date.now()}`,
      artworkTitle: form.artworkTitle,
      artworkId: form.artworkId || `art-${Date.now()}`,
      ownerName: form.ownerName,
      ownerEmail: form.ownerEmail,
      issuedDate: new Date().toISOString().split("T")[0],
      expiryDate: form.expiryDate || "N/A",
      status: "Valid",
      blockchainHash: `0x${Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}`,
      verifiedBy: form.verifiedBy || "Aduna Gallery",
    };
    onCreate(newCert);
    setForm({ artworkTitle: "", artworkId: "", ownerName: "", ownerEmail: "", expiryDate: "", verifiedBy: "Aduna Gallery" });
    setShowCreateModal(false);
  };

  const handleUpdate = () => {
    if (!editingCert) return;
    onUpdate(editingCert.id, {
      artworkTitle: form.artworkTitle || editingCert.artworkTitle,
      ownerName: form.ownerName || editingCert.ownerName,
      ownerEmail: form.ownerEmail || editingCert.ownerEmail,
      expiryDate: form.expiryDate || editingCert.expiryDate,
      verifiedBy: form.verifiedBy || editingCert.verifiedBy,
    });
    setEditingCert(null);
    setForm({ artworkTitle: "", artworkId: "", ownerName: "", ownerEmail: "", expiryDate: "", verifiedBy: "Aduna Gallery" });
  };

  const openEditModal = (cert: AdminCertificate) => {
    setEditingCert(cert);
    setForm({ artworkTitle: cert.artworkTitle, artworkId: cert.artworkId, ownerName: cert.ownerName, ownerEmail: cert.ownerEmail, expiryDate: cert.expiryDate, verifiedBy: cert.verifiedBy });
    setOpenMenuId(null);
  };

  const FormModal = ({ title, onSubmit, submitLabel }: { title: string; onSubmit: () => void; submitLabel: string }) => (
    <div className="fixed inset-0 bg-ebony-deep/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-parchment-ivory border border-outline-variant/30 w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-ebony-deep">{title}</h3>
          <button onClick={() => { setShowCreateModal(false); setEditingCert(null); }} className="text-on-surface-variant hover:text-ebony-deep cursor-pointer border-0 bg-transparent"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
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
              <input type="date" value={form.expiryDate === "N/A" ? "" : form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider mb-1">{lang === "fr" ? "Certifié par" : "Verified By"}</label>
              <input type="text" value={form.verifiedBy} onChange={(e) => setForm({ ...form, verifiedBy: e.target.value })} className="w-full bg-surface-container-lowest border border-outline-variant/30 px-3 py-2.5 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf" placeholder="Aduna Gallery" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-outline-variant/30">
          <button onClick={() => { setShowCreateModal(false); setEditingCert(null); }} className="px-4 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider text-on-surface-variant hover:text-ebony-deep transition-colors cursor-pointer border-0 bg-transparent">{lang === "fr" ? "Annuler" : "Cancel"}</button>
          <button onClick={onSubmit} disabled={!form.artworkTitle || !form.ownerName} className="bg-ebony-deep text-parchment-ivory px-6 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer border-0">{submitLabel}</button>
        </div>
      </div>
    </div>
  );

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
          <button onClick={() => { setForm({ artworkTitle: "", artworkId: "", ownerName: "", ownerEmail: "", expiryDate: "", verifiedBy: "Aduna Gallery" }); setShowCreateModal(true); }} className="bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-wider px-4 py-2 hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer border-0">
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
                  <td className="px-4 py-3 text-right relative">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => copyHash(cert.blockchainHash, cert.id)} className="p-1.5 text-ebony-deep/60 hover:text-gold-leaf transition-colors cursor-pointer border-0 bg-transparent" title={lang === "fr" ? "Copier le hash" : "Copy hash"}>
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setOpenMenuId(openMenuId === cert.id ? null : cert.id)} className="p-1.5 text-ebony-deep/60 hover:text-ebony-deep transition-colors cursor-pointer border-0 bg-transparent">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    {openMenuId === cert.id && (
                      <div className="absolute right-4 top-full mt-1 bg-parchment-ivory border border-outline-variant/30 shadow-lg z-20 min-w-[160px]">
                        <button onClick={() => openEditModal(cert)} className="w-full text-left px-4 py-2.5 text-xs font-sans flex items-center gap-2 hover:bg-surface-container/40 text-ebony-deep cursor-pointer border-0 bg-transparent">
                          <Pencil className="w-3.5 h-3.5" /> {lang === "fr" ? "Modifier" : "Edit"}
                        </button>
                        {cert.status === "Valid" && (
                          <button onClick={() => { if (confirm(lang === "fr" ? `Révoquer le certificat ${cert.id} ?` : `Revoke certificate ${cert.id}?`)) { onRevoke(cert.id); setOpenMenuId(null); } }} className="w-full text-left px-4 py-2.5 text-xs font-sans flex items-center gap-2 hover:bg-surface-container/40 text-amber-700 cursor-pointer border-0 bg-transparent">
                            <Ban className="w-3.5 h-3.5" /> {lang === "fr" ? "Révoquer" : "Revoke"}
                          </button>
                        )}
                        <button onClick={() => { copyHash(cert.blockchainHash, cert.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-xs font-sans flex items-center gap-2 hover:bg-surface-container/40 text-ebony-deep cursor-pointer border-0 bg-transparent">
                          <Copy className="w-3.5 h-3.5" /> {lang === "fr" ? "Copier le hash" : "Copy Hash"}
                        </button>
                        <button onClick={() => { if (confirm(lang === "fr" ? `Supprimer le certificat ${cert.id} ? Cette action est irréversible.` : `Delete certificate ${cert.id}? This cannot be undone.`)) { onDelete(cert.id); setOpenMenuId(null); } }} className="w-full text-left px-4 py-2.5 text-xs font-sans flex items-center gap-2 hover:bg-surface-container/40 text-red-700 cursor-pointer border-0 bg-transparent">
                          <Trash2 className="w-3.5 h-3.5" /> {lang === "fr" ? "Supprimer" : "Delete"}
                        </button>
                      </div>
                    )}
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

      {showCreateModal && <FormModal title={lang === "fr" ? "Créer un Certificat" : "Create Certificate"} onSubmit={handleCreate} submitLabel={lang === "fr" ? "Créer" : "Create"} />}
      {editingCert && <FormModal title={lang === "fr" ? "Modifier le Certificat" : "Edit Certificate"} onSubmit={handleUpdate} submitLabel={lang === "fr" ? "Enregistrer" : "Save"} />}
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { AdminArtwork, AdminView } from "@/lib/adminTypes";
import { useTranslate } from "@/lib/translations";
import {
  Search,
  Plus,
  ChevronDown,
  Eye,
  EyeOff,
  Trash2,
  BadgeCheck,
  MoreVertical,
} from "lucide-react";

interface ArtworksViewProps {
  artworks: AdminArtwork[];
  auditLogs: Array<{ id: string; user: string; timestamp: string; action: string }>;
  onAddArtwork: (artwork: AdminArtwork) => void;
  onDeleteArtwork: (id: string) => void;
  onUpdateStatus: (id: string, status: AdminArtwork["status"]) => void;
  onRiskScan: (artwork: AdminArtwork) => void;
  setActiveView: (view: AdminView) => void;
}

export default function ArtworksView({
  artworks,
  auditLogs,
  onAddArtwork,
  onDeleteArtwork,
  onUpdateStatus,
  onRiskScan,
  setActiveView,
}: ArtworksViewProps) {
  const { lang } = useTranslate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [tierFilter, setTierFilter] = useState<string>("All Tiers");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = artworks;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q) ||
          a.culture.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((a) => a.status === statusFilter);
    }
    if (tierFilter !== "All Tiers") {
      result = result.filter((a) => a.tier === tierFilter);
    }
    return result;
  }, [artworks, searchQuery, statusFilter, tierFilter]);

  const recentLogs = auditLogs.slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-medium text-ebony-deep">
          {lang === "fr" ? "Inventaire de Chefs-d'Œuvre" : "Masterpiece Inventory"}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-on-surface-variant font-sans">
            {artworks.length} {lang === "fr" ? "Total des Actifs" : "Total Assets"}
          </span>
          <button
            onClick={() => {
              const newArtwork: AdminArtwork = {
                id: `art-${Date.now()}`,
                title: lang === "fr" ? "Nouvelle Œuvre" : "New Artwork",
                culture: "",
                era: "",
                valuation: 0,
                status: "Draft",
                tier: "Standard",
                imageUrl: "",
                description: "",
                provenanceHash: "",
                dateCreated: new Date().toISOString().split("T")[0],
                acquiredYear: new Date().getFullYear(),
                acquiredMethod: "",
                provenance: [],
              };
              onAddArtwork(newArtwork);
            }}
            className="bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-wider px-4 py-2.5 hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer border-0"
          >
            <Plus className="w-4 h-4" />
            {lang === "fr" ? "Ajouter une Œuvre" : "Add Artwork"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
          <input
            type="text"
            placeholder={lang === "fr" ? "Rechercher par titre, ID, culture..." : "Search by title, ID, culture..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf cursor-pointer"
        >
          <option>{lang === "fr" ? "Tous" : "All"}</option>
          <option>{lang === "fr" ? "En Direct" : "Live"}</option>
          <option>{lang === "fr" ? "Brouillon" : "Draft"}</option>
          <option>{lang === "fr" ? "Non Publié" : "Unpublished"}</option>
        </select>
        <div className="flex gap-1 bg-surface-container-low border border-outline-variant/50 p-0.5">
          {(["All Tiers", "VIP", "Prestige", "Standard"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-3 py-1.5 text-xs font-sans font-semibold transition-all ${
                tierFilter === t
                  ? "bg-ebony-deep text-parchment-ivory"
                  : "text-on-surface-variant hover:text-ebony-deep"
              }`}
            >
              {t === "All Tiers" ? (lang === "fr" ? "Tous les Niveaux" : "All Tiers") : t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* Table */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/30 text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant">
                  <th className="text-left px-4 py-3">Artwork</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Curation</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Region/Era</th>
                  <th className="text-right px-4 py-3">Valuation</th>
                  <th className="text-center px-4 py-3">Status</th>
                  <th className="text-center px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((artwork) => (
                  <tr
                    key={artwork.id}
                    className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-container-high flex-shrink-0 overflow-hidden">
                          <img
                            src={artwork.imageUrl}
                            alt={artwork.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-sans font-medium text-ebony-deep text-xs">
                            {artwork.title}
                          </p>
                          <p className="font-mono text-[10px] text-on-surface-variant">
                            {artwork.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="font-sans text-xs text-ebony-deep">{artwork.tier}</p>
                      <p className="font-sans text-[10px] text-on-surface-variant">
                        {artwork.culture}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="font-sans text-xs text-on-surface-variant">
                        {artwork.era}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-serif font-semibold text-sm text-ebony-deep">
                        {artwork.valuation === "POR"
                          ? "POR"
                          : `€${artwork.valuation.toLocaleString()}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-sans font-bold tracking-wide uppercase ${
                          artwork.status === "Live"
                            ? "bg-emerald-100 text-emerald-800"
                            : artwork.status === "Draft"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {artwork.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center relative">
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === artwork.id ? null : artwork.id)
                        }
                        className="p-1.5 text-ebony-deep/70 hover:text-ebony-deep hover:bg-surface-container-high transition-colors cursor-pointer border-0 bg-transparent"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openDropdown === artwork.id && (
                        <div className="absolute right-0 top-full mt-1 bg-surface-container-lowest border border-outline-variant/50 shadow-lg z-20 w-48 py-1">
                          {artwork.status !== "Live" && (
                            <button
                              onClick={() => {
                                onUpdateStatus(artwork.id, "Live");
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-sans text-ebony-deep hover:bg-surface-container-low flex items-center gap-2"
                            >
                               <Eye className="w-3 h-3" /> {lang === "fr" ? "Publier en Direct" : "Publish Live"}
                            </button>
                          )}
                          {artwork.status === "Live" && (
                            <button
                              onClick={() => {
                                onUpdateStatus(artwork.id, "Draft");
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-sans text-ebony-deep hover:bg-surface-container-low flex items-center gap-2"
                            >
                               <EyeOff className="w-3 h-3" /> {lang === "fr" ? "Revenir au Brouillon" : "Revert to Draft"}
                            </button>
                          )}
                          {artwork.status === "Unpublished" && (
                            <button
                              onClick={() => {
                                onUpdateStatus(artwork.id, "Draft");
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-sans text-ebony-deep hover:bg-surface-container-low flex items-center gap-2"
                            >
                               <Eye className="w-3 h-3" /> {lang === "fr" ? "Revenir au Brouillon" : "Revert to Draft"}
                            </button>
                          )}
                          {artwork.status !== "Unpublished" && (
                            <button
                              onClick={() => {
                                onUpdateStatus(artwork.id, "Unpublished");
                                setOpenDropdown(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-sans text-ebony-deep hover:bg-surface-container-low flex items-center gap-2"
                            >
                               <EyeOff className="w-3 h-3" /> {lang === "fr" ? "Dépublier" : "Unpublish"}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onRiskScan(artwork);
                              setActiveView(AdminView.Compliance);
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-sans text-ebony-deep hover:bg-surface-container-low flex items-center gap-2"
                          >
                             <BadgeCheck className="w-3 h-3" /> {lang === "fr" ? "Vérifier la Provenance" : "Verify Provenance"}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${artwork.title}"? This cannot be undone.`)) {
                                onDeleteArtwork(artwork.id);
                              }
                              setOpenDropdown(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-sans text-terracotta-earth hover:bg-terracotta-earth/5 flex items-center gap-2"
                          >
                             <Trash2 className="w-3 h-3" /> {lang === "fr" ? "Archiver Supprimer" : "Archive Delete"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-on-surface-variant text-sm font-sans">
                      {lang === "fr" ? "Aucune œuvre ne correspond à vos filtres." : "No artworks match your filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side widgets */}
        <div className="lg:col-span-3 space-y-4">
          {/* Audit Trail */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-4">
            <h3 className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-4">
              {lang === "fr" ? "Piste d'Audit Récente" : "Recent Audit Trail"}
            </h3>
            <div className="space-y-3">
              {recentLogs.map((log, i) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-gold-leaf mt-1.5" />
                    {i < recentLogs.length - 1 && (
                      <div className="absolute left-[3px] top-4 w-[2px] h-6 bg-outline-variant/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs text-ebony-deep truncate">{log.action}</p>
                    <p className="font-sans text-[10px] text-on-surface-variant">
                      {log.user} &middot; {log.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveView(AdminView.AuditLog)}
              className="mt-4 text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-gold-leaf hover:text-ebony-deep transition-colors"
            >
              View All &rarr;
            </button>
          </div>

          {/* Gallery Overview */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-4">
            <h3 className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-4">
              {lang === "fr" ? "Aperçu de la Galerie" : "Gallery Overview"}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-low p-3">
                <p className="font-serif text-2xl font-semibold text-ebony-deep">
                  {artworks.length}
                </p>
                <p className="text-[10px] font-sans text-on-surface-variant">{lang === "fr" ? "Total des Actifs" : "Total Assets"}</p>
              </div>
              <div className="bg-surface-container-low p-3">
                <p className="font-serif text-2xl font-semibold text-gold-leaf">
                  {artworks.filter((a) => a.valuation === "POR").length}
                </p>
                <p className="text-[10px] font-sans text-on-surface-variant">{lang === "fr" ? "POR Actif" : "Active POR"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

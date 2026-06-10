"use client";

import { useState, useMemo } from "react";
import { AdminCollector } from "@/lib/adminTypes";
import {
  Search,
  Plus,
  Globe,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

interface CollectorsViewProps {
  collectors: AdminCollector[];
  onAddCollector: (collector: AdminCollector) => void;
  onToggleAML: (id: string) => void;
}

export default function CollectorsView({
  collectors,
  onAddCollector,
  onToggleAML,
}: CollectorsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newTier, setNewTier] = useState<"VIP" | "Prestige" | "Standard">("Standard");
  const [newCountry, setNewCountry] = useState("");

  const filtered = useMemo(() => {
    let result = collectors;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.tier.toLowerCase().includes(q)
      );
    }
    if (tierFilter !== "All") {
      result = result.filter((c) => c.tier === tierFilter);
    }
    return result;
  }, [collectors, searchQuery, tierFilter]);

  const totalValue = collectors.reduce((sum, c) => sum + c.purchasedValue, 0);
  const verifiedCount = collectors.filter((c) => c.amlStatus === "Verified").length;
  const clearanceRate = collectors.length
    ? Math.round((verifiedCount / collectors.length) * 100)
    : 0;

  const handleAdd = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const colors = ["#C5A059", "#B35C44", "#0F0F0F", "#6B8E23", "#4A6FA5"];
    const newCollector: AdminCollector = {
      id: `COL-${String(collectors.length + 1).padStart(3, "0")}`,
      name: newName.trim(),
      email: newEmail.trim(),
      country: newCountry.trim() || "Unknown",
      tier: newTier,
      purchasedValue: 0,
      acquisitionsCount: 0,
      amlStatus: "Pending",
      joinedDate: new Date().toISOString().split("T")[0],
      avatarColor: colors[collectors.length % colors.length],
    };
    onAddCollector(newCollector);
    setNewName("");
    setNewEmail("");
    setNewCountry("");
    setNewTier("Standard");
    setShowAddForm(false);
  };

  const getAMLBadge = (status: AdminCollector["amlStatus"]) => {
    switch (status) {
      case "Verified":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-sans font-bold">
            <CheckCircle className="w-3 h-3" /> AML Cleared
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-sans font-bold">
            <Clock className="w-3 h-3" /> Checking
          </span>
        );
      case "Unverified":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-sans font-bold">
            <AlertCircle className="w-3 h-3" /> Pending KYC
          </span>
        );
    }
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4">
          <p className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1">
            Total Holdings
          </p>
          <p className="font-serif text-xl font-semibold text-ebony-deep">
            €{totalValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4">
          <p className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1">
            Active Patrons
          </p>
          <p className="font-serif text-xl font-semibold text-ebony-deep">
            {collectors.length}
          </p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-4">
          <p className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1">
            AML Clearance
          </p>
          <p className="font-serif text-xl font-semibold text-emerald-700">{clearanceRate}%</p>
        </div>
      </div>

      <h2 className="font-serif text-2xl font-medium text-ebony-deep mb-4">
        Collector Ledger
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
          <input
            type="text"
            placeholder="Search collectors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-surface-container-low border border-outline-variant/50 p-0.5">
          {["All", "VIP", "Prestige", "Standard"].map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-3 py-1.5 text-xs font-sans font-semibold transition-all ${
                tierFilter === t
                  ? "bg-ebony-deep text-parchment-ivory"
                  : "text-on-surface-variant hover:text-ebony-deep"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-ebony-deep text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" /> Enroll Patron
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 mb-6 animate-fade-in">
          <h3 className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-4">
            New Collector Enrollment
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf"
            />
            <input
              type="email"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf"
            />
            <input
              type="text"
              placeholder="Country"
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              className="px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf"
            />
            <select
              value={newTier}
              onChange={(e) => setNewTier(e.target.value as "VIP" | "Prestige" | "Standard")}
              className="px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf cursor-pointer"
            >
              <option value="Standard">Standard</option>
              <option value="Prestige">Prestige</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-ebony-deep text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Register Patron
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-outline-variant/50 text-on-surface-variant text-xs font-sans font-semibold hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant/30 text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant">
              <th className="text-left px-4 py-3">Collector</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Region</th>
              <th className="text-left px-4 py-3">Tier</th>
              <th className="text-right px-4 py-3 hidden md:table-cell">Holdings</th>
              <th className="text-center px-4 py-3 hidden lg:table-cell">Acquisitions</th>
              <th className="text-center px-4 py-3">AML</th>
              <th className="text-center px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((collector) => (
              <tr
                key={collector.id}
                className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: collector.avatarColor }}
                    >
                      {collector.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-sans font-medium text-ebony-deep text-xs">
                        {collector.name}
                      </p>
                      <p className="font-mono text-[10px] text-on-surface-variant">
                        {collector.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-on-surface-variant/60" />
                    <span className="font-sans text-xs text-on-surface-variant">
                      {collector.country}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-sans font-bold tracking-wide uppercase ${
                      collector.tier === "VIP"
                        ? "bg-gold-leaf/10 text-gold-leaf"
                        : collector.tier === "Prestige"
                        ? "bg-terracotta-earth/10 text-terracotta-earth"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {collector.tier}
                  </span>
                </td>
                <td className="px-4 py-3 text-right hidden md:table-cell">
                  <span className="font-serif font-semibold text-sm text-ebony-deep">
                    €{collector.purchasedValue.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center hidden lg:table-cell">
                  <span className="font-sans text-sm text-ebony-deep">
                    {collector.acquisitionsCount}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">{getAMLBadge(collector.amlStatus)}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onToggleAML(collector.id)}
                    className="text-[10px] font-sans font-bold text-gold-leaf hover:text-ebony-deep transition-colors uppercase tracking-wide"
                  >
                    Cycle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { AdminUser } from "@/lib/adminTypes";
import { useTranslate } from "@/lib/translations";
import {
  Search,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Building,
  Calendar,
  MoreVertical,
  Trash2,
  Ban,
  CheckCircle,
} from "lucide-react";

interface UsersViewProps {
  users: AdminUser[];
  onUpdateStatus: (id: string, status: AdminUser["status"]) => void;
  onDelete: (id: string) => void;
}

export default function UsersView({ users, onUpdateStatus, onDelete }: UsersViewProps) {
  const { lang } = useTranslate();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-terracotta-earth/10 text-terracotta-earth",
      advisor: "bg-blue-100 text-blue-800",
      prestige: "bg-gold-leaf/10 text-gold-leaf",
      collector: "bg-emerald-100 text-emerald-800",
      visitor: "bg-gray-100 text-gray-600",
    };
    return colors[role] || "bg-gray-100 text-gray-600";
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      Active: "bg-emerald-100 text-emerald-800",
      Suspended: "bg-red-100 text-red-800",
      Pending: "bg-amber-100 text-amber-800",
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="font-serif text-2xl font-medium text-ebony-deep">
          {lang === "fr" ? "Gestion des Utilisateurs" : "User Management"}
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder={lang === "fr" ? "Rechercher..." : "Search..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-56 bg-surface-container-lowest border border-outline-variant/30 pl-9 pr-3 py-2 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant/30 px-3 py-2 text-xs font-sans text-ebony-deep focus:outline-none focus:border-gold-leaf cursor-pointer"
          >
            <option value="all">{lang === "fr" ? "Tous les rôles" : "All roles"}</option>
            <option value="admin">{lang === "fr" ? "Admin" : "Admin"}</option>
            <option value="advisor">{lang === "fr" ? "Conseiller" : "Advisor"}</option>
            <option value="prestige">{lang === "fr" ? "Prestige" : "Prestige"}</option>
            <option value="collector">{lang === "fr" ? "Collectionneur" : "Collector"}</option>
            <option value="visitor">{lang === "fr" ? "Visiteur" : "Visitor"}</option>
          </select>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans">
            <thead>
              <tr className="border-b border-outline-variant/30 text-[10px] uppercase tracking-wider text-on-surface-variant">
                <th className="text-left px-4 py-3 font-semibold">{lang === "fr" ? "Utilisateur" : "User"}</th>
                <th className="text-left px-4 py-3 font-semibold">{lang === "fr" ? "Rôle" : "Role"}</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">{lang === "fr" ? "Institution" : "Institution"}</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">{lang === "fr" ? "Inscrit" : "Joined"}</th>
                <th className="text-left px-4 py-3 font-semibold">{lang === "fr" ? "Statut" : "Status"}</th>
                <th className="text-right px-4 py-3 font-semibold">{lang === "fr" ? "Actions" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-outline-variant/10 hover:bg-surface-container/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-terracotta-earth/10 flex items-center justify-center border border-terracotta-earth/25 shrink-0">
                        <span className="font-serif text-[10px] font-bold text-terracotta-earth">
                          {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-ebony-deep truncate">{user.name}</p>
                        <p className="text-on-surface-variant/60 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${roleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3 h-3 shrink-0" />
                      <span className="truncate max-w-[120px]">{user.institution || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 shrink-0" />
                      {user.joinedDate}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                      className="p-1 text-on-surface-variant/50 hover:text-ebony-deep transition-colors cursor-pointer border-0 bg-transparent"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenuId === user.id && (
                      <div className="absolute right-4 top-full mt-1 bg-parchment-ivory border border-outline-variant/30 shadow-lg z-20 min-w-[160px]">
                        {user.status !== "Active" && (
                          <button
                            onClick={() => { onUpdateStatus(user.id, "Active"); setOpenMenuId(null); }}
                            className="w-full text-left px-4 py-2.5 text-xs font-sans flex items-center gap-2 hover:bg-surface-container/40 text-emerald-700 cursor-pointer border-0 bg-transparent"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> {lang === "fr" ? "Activer" : "Activate"}
                          </button>
                        )}
                        {user.status !== "Suspended" && user.role !== "admin" && (
                          <button
                            onClick={() => { onUpdateStatus(user.id, "Suspended"); setOpenMenuId(null); }}
                            className="w-full text-left px-4 py-2.5 text-xs font-sans flex items-center gap-2 hover:bg-surface-container/40 text-amber-700 cursor-pointer border-0 bg-transparent"
                          >
                            <Ban className="w-3.5 h-3.5" /> {lang === "fr" ? "Suspendre" : "Suspend"}
                          </button>
                        )}
                        {user.role !== "admin" && (
                          <button
                            onClick={() => { if (confirm(lang === "fr" ? `Supprimer ${user.name} ?` : `Delete ${user.name}?`)) { onDelete(user.id); setOpenMenuId(null); } }}
                            className="w-full text-left px-4 py-2.5 text-xs font-sans flex items-center gap-2 hover:bg-surface-container/40 text-red-700 cursor-pointer border-0 bg-transparent"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> {lang === "fr" ? "Supprimer" : "Delete"}
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-on-surface-variant/50">
                    {lang === "fr" ? "Aucun utilisateur trouvé" : "No users found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center text-[10px] text-on-surface-variant/50 font-sans">
        <span>{filtered.length} {lang === "fr" ? "utilisateurs" : "users"}</span>
        <span>{lang === "fr" ? "Total: " : "Total: "}{users.length} {lang === "fr" ? "utilisateurs" : "users"}</span>
      </div>
    </div>
  );
}

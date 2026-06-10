"use client";

import { useState } from "react";
import {
  Settings,
  Server,
  Cpu,
  Radio,
  Mail,
  Save,
  CheckCircle,
} from "lucide-react";

export default function SettingsView() {
  const [rpcUrl, setRpcUrl] = useState("https://rpc.aduna-gallery.ch/v2");
  const [regEmail, setRegEmail] = useState("compliance@aduna-gallery.ch");
  const [autoRevoke, setAutoRevoke] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-medium text-ebony-deep mb-6">
        System Node Settings
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* Form */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/30 p-6">
          <h3 className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-4">
            Node Configuration
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1.5">
                RPC Endpoint URL
              </label>
              <input
                type="url"
                value={rpcUrl}
                onChange={(e) => setRpcUrl(e.target.value)}
                className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-mono text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf"
              />
            </div>

            <div>
              <label className="block text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-1.5">
                Regulatory Compliance Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/60" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low border border-outline-variant/50 text-sm font-sans text-ebony-deep placeholder:text-on-surface-variant/40 focus:outline-none focus:border-gold-leaf"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-outline-variant/20">
              <div>
                <p className="font-sans text-sm font-medium text-ebony-deep">
                  Auto-Revocation Protocol
                </p>
                <p className="font-sans text-[11px] text-on-surface-variant">
                  Automatically revoke access for expired certificates
                </p>
              </div>
              <button
                onClick={() => setAutoRevoke(!autoRevoke)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  autoRevoke ? "bg-gold-leaf" : "bg-outline-variant/50"
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                    autoRevoke ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-ebony-deep text-parchment-ivory text-xs font-sans font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-parchment-ivory/30 border-t-parchment-ivory rounded-full animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" /> Saved
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Save Settings
                </>
              )}
            </button>
          </div>
        </div>

        {/* Health monitors */}
        <div className="lg:col-span-3">
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-6">
            <h3 className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase text-on-surface-variant mb-4">
              Node Health Monitors
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-on-surface-variant/60" />
                  <div>
                    <p className="font-sans text-xs font-medium text-ebony-deep">CPU Usage</p>
                    <p className="font-sans text-[10px] text-on-surface-variant">
                      Ledger processing node
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-emerald-700 font-semibold">23%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-on-surface-variant/60" />
                  <div>
                    <p className="font-sans text-xs font-medium text-ebony-deep">Vite Sync</p>
                    <p className="font-sans text-[10px] text-on-surface-variant">
                      Build & hot reload
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-emerald-700 font-semibold">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <Server className="w-4 h-4 text-on-surface-variant/60" />
                  <div>
                    <p className="font-sans text-xs font-medium text-ebony-deep">Peer Nodes</p>
                    <p className="font-sans text-[10px] text-on-surface-variant">
                      Distributed network
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-emerald-700 font-semibold">12 / 12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

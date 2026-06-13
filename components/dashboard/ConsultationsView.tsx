"use client";

import { useState } from "react";
import { Consultation } from "@/lib/dashboardTypes";
import {
  Clock,
  Video,
  Gavel,
  Plus,
  X,
  BookmarkCheck,
  AlertCircle,
  CalendarDays
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslate } from "@/lib/translations";

interface ConsultationsViewProps {
  consultations: Consultation[];
  onAddConsultation: (newCons: Consultation) => void;
}

export default function ConsultationsView({ consultations, onAddConsultation }: ConsultationsViewProps) {
  const { lang } = useTranslate();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState('Diop');
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('2026-06-18');
  const [slot, setSlot] = useState('14:30 - 15:30 GMT');
  const [customNotes, setCustomNotes] = useState('');

  const experts = [
    { id: 'Diop', name: 'Dr. Amara Diop', title: 'Director of West African Antiquities', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150' },
    { id: 'Vanhoutte', name: 'Christian Vanhoutte', title: 'Chief Conservator & Materials Analyst', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150' }
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    const chosenExpert = experts.find(ex => ex.id === selectedExpert) || experts[0];
    const newConsultation: Consultation = {
      id: `cons_${Date.now()}`,
      expertName: chosenExpert.name,
      expertTitle: chosenExpert.title,
      expertAvatar: chosenExpert.avatar,
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      timeSlot: slot,
      topic: topic,
      status: 'Confirmed',
      notes: customNotes || 'Vetting of physical artifact images loaded.'
    };
    onAddConsultation(newConsultation);
    setShowBookingModal(false);
    setTopic('');
    setCustomNotes('');
  };

  return (
    <div className="animate-fade-in relative">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-6 border-b border-ebony-deep/10">
        <div>
          <h2 className="font-serif text-3xl font-medium text-ebony-deep leading-tight">{lang === "fr" ? "Consultations et Conseil de Vérification" : "Consultations & Vetting Advisory"}</h2>
          <p className="font-sans text-xs text-on-surface-variant mt-1">Coordinate with expert conservators to verify carbon-rating indexes, wood compositions, and authorize regional legal export licenses.</p>
        </div>
        <button onClick={() => setShowBookingModal(true)} className="bg-ebony-deep text-parchment-ivory font-sans text-xs font-semibold uppercase tracking-widest px-6 py-3.5 hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer border-0 shadow-sm">
          <Plus className="w-4 h-4" /> {lang === "fr" ? "Demander un Appel de Conseil" : "Request Advisory Call"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h3 className="font-serif text-lg font-medium text-ebony-deep mb-2">{lang === "fr" ? "Conférences Privées Programmées" : "Scheduled Private Conferences"}</h3>
          {consultations.length === 0 ? (
            <div className="bg-parchment-ivory border border-dashed border-ebony-deep/10 p-12 text-center select-none">
              <Gavel className="w-10 h-10 text-gold-leaf mx-auto mb-4" />
              <p className="font-serif text-lg text-ebony-deep">{lang === "fr" ? "Aucune Session de Conseil de Vérification Programmée" : "No Vetting Advisory Sessions Scheduled"}</p>
              <p className="font-sans text-xs text-zinc-450 mt-1 max-w-sm mx-auto">Schedule an academic review to clear legal export certificate details or prepare carbon audits.</p>
            </div>
          ) : (
            consultations.map((item) => (
              <div key={item.id} className="bg-parchment-ivory border border-ebony-deep/5 p-6 flex flex-col md:flex-row gap-6 justify-between shadow-level-1 hover:translate-y-[-1px] transition-all">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-gold-leaf/20 select-none"><img src={item.expertAvatar} alt={item.expertName} className="w-full h-full object-cover" /></div>
                  <div>
                    <h4 className="font-serif text-base font-semibold text-ebony-deep">{item.expertName}</h4>
                    <p className="font-sans text-[11px] text-zinc-400 font-semibold uppercase tracking-wider mb-2">{item.expertTitle}</p>
                    <div className="space-y-1 bg-surface-container-low p-3 max-w-md border-l-2 border-l-gold-leaf">
                      <p className="font-sans text-[10px] uppercase font-bold text-zinc-400">Consultation Focus Topic</p>
                      <p className="font-sans text-xs text-ebony-deep font-medium">{item.topic}</p>
                    </div>
                    {item.notes && <p className="font-sans text-[11px] text-zinc-400 mt-2.5 max-w-md italic leading-normal">Note: &quot;{item.notes}&quot;</p>}
                  </div>
                </div>
                <div className="flex flex-col justify-between items-start md:items-end gap-4 shrink-0 text-left md:text-right border-t md:border-t-0 border-ebony-deep/5 pt-4 md:pt-0">
                  <div className="space-y-1">
                    <span className={`inline-flex px-2 py-0.5 font-sans text-[9px] font-bold uppercase tracking-wider border ${item.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-800 border-emerald-250/30' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>{item.status}</span>
                    <p className="font-sans text-xs text-ebony-deep font-bold flex items-center gap-1.5 justify-start md:justify-end mt-1"><CalendarDays className="w-4 h-4 text-gold-leaf" /> {item.date}</p>
                    <p className="font-sans text-[11px] text-zinc-400 flex items-center gap-1.5 justify-start md:justify-end"><Clock className="w-3.5 h-3.5" /> {item.timeSlot}</p>
                  </div>
                  {item.status === 'Confirmed' ? (
                    <button onClick={() => alert(`Synchronizing secure premium video feed channel. Room token issued for ${item.expertName}.`)} className="bg-ebony-deep text-parchment-ivory font-sans text-[10px] font-bold uppercase tracking-widest px-4 py-2 hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer">
                      <Video className="w-3.5 h-3.5" /> {lang === "fr" ? "Lancer le Conseil Vidéo" : "Launch Video Advisory"}
                    </button>
                  ) : (
                    <p className="text-[10px] text-zinc-500 font-sans uppercase">Awaiting Specialist Clearance</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-parchment-ivory border border-ebony-deep/5 p-8 shadow-level-1 space-y-6">
            <h3 className="font-serif text-lg font-medium text-ebony-deep border-b border-gold-leaf/20 pb-4 flex items-center gap-2"><BookmarkCheck className="w-4 h-4 text-gold-leaf" /> {lang === "fr" ? "Engagement de Vérification Académique" : "Academic Vetting Vow"}</h3>
            <div className="space-y-4 font-sans text-xs text-zinc-500 leading-relaxed">
              <p>Aduna Gallery collaborates exclusively with recognized, credentialed experts from European, American, and continental research centers.</p>
              <div className="bg-zinc-50 p-4 border border-ebony-deep/5">
                <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-terracotta-earth mb-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Radiometric Testing Rules</p>
                <p className="text-[11px] leading-relaxed">Timber and carbon testing is performed using micro-sample spectroscopy. All results are logged on immutable chain registries for dual-verification.</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-ebony-deep uppercase tracking-wider text-[10px]">Active Advisory Specialists</p>
                <div className="flex -space-x-3 overflow-hidden select-none mb-3">
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150" alt="Specialist" />
                  <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150" alt="Specialist" />
                  <div className="inline-block h-8 w-8 rounded-full bg-slate-300 ring-2 ring-white font-mono text-[10px] flex items-center justify-center font-bold text-zinc-500">+4</div>
                </div>
                <p className="text-[11px]">All scheduled conferences are routed via high-definition, encrypted lines, preserving strict customer spatial confidentiality.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 bg-ebony-deep/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-parchment-ivory border border-gold-leaf w-full max-w-xl text-ebony-deep">
              <div className="px-8 py-5 border-b border-gold-leaf/20 bg-ebony-deep text-gold-leaf flex items-center justify-between sticky top-0">
                <h3 className="font-serif text-base font-semibold tracking-wide uppercase">{lang === "fr" ? "Programmer une Conférence de Vérification du Conservateur" : "Schedule Curator Vetting Conference"}</h3>
                <button type="button" onClick={() => setShowBookingModal(false)} className="text-gold-leaf hover:text-white cursor-pointer focus:outline-none"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-8">
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="flex flex-col">
                    <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">{lang === "fr" ? "Choisir un Conseiller Expert Spécialiste" : "Choose Specialist Expert Advisor"}</label>
                    <div className="grid grid-cols-2 gap-4">
                      {experts.map((exp) => (
                        <div key={exp.id} onClick={() => setSelectedExpert(exp.id)} className={`p-4 border text-left cursor-pointer transition-all flex gap-3 items-center ${selectedExpert === exp.id ? 'border-gold-leaf bg-white ring-1 ring-gold-leaf/25' : 'border-ebony-deep/5 bg-zinc-50 opacity-70'}`}>
                          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0"><img src={exp.avatar} alt={exp.name} className="w-full h-full object-cover" /></div>
                          <div>
                            <h5 className="font-serif text-xs font-bold leading-none mb-1">{exp.name}</h5>
                            <p className="font-sans text-[10px] text-zinc-400 line-clamp-1">{exp.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5 flex items-center gap-1">{lang === "fr" ? "Sujet Principal de la Conférence" : "Conference Focus Topic"} <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="e.g. Benin Bronze authenticity verification" value={topic} onChange={(e) => setTopic(e.target.value)} className="bg-white border border-ebony-deep/15 focus:border-gold-leaf p-3 text-xs focus:outline-none w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5">{lang === "fr" ? "Date de la Conférence" : "Conference Date"}</label>
                      <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="bg-white border border-ebony-deep/15 focus:border-gold-leaf p-3 text-xs focus:outline-none text-ebony-deep" />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5">{lang === "fr" ? "Créneau Horaire Disponible" : "Available Time Slot"}</label>
                      <select value={slot} onChange={(e) => setSlot(e.target.value)} className="bg-white border border-ebony-deep/15 focus:border-gold-leaf p-3 text-xs focus:outline-none text-ebony-deep">
                        <option value="11:00 - 12:30 GMT">11:00 - 12:30 GMT</option>
                        <option value="14:00 - 15:30 GMT">14:00 - 15:30 GMT</option>
                        <option value="16:00 - 17:30 GMT">16:00 - 17:30 GMT</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-sans text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1.5">{lang === "fr" ? "Notes Préparatoires du Conservateur" : "Curator Preparatory Notes"}</label>
                    <textarea rows={2} placeholder="Indicate special requests, provenance records context, or catalog issues..." value={customNotes} onChange={(e) => setCustomNotes(e.target.value)} className="bg-white border border-ebony-deep/15 focus:border-gold-leaf p-3 text-xs focus:outline-none w-full" />
                  </div>
                  <div className="flex justify-end gap-4 pt-6 border-t border-ebony-deep/5">
                    <button type="button" onClick={() => setShowBookingModal(false)} className="bg-transparent border border-ebony-deep/12 px-6 py-2.5 text-xs font-sans font-bold uppercase tracking-widest text-zinc-450 hover:text-ebony-deep">{lang === "fr" ? "Passer" : "Bypass"}</button>
                    <button type="submit" className="bg-ebony-deep text-parchment-ivory px-8 py-2.5 text-xs font-sans font-bold uppercase tracking-widest hover:opacity-90 active:scale-98 transition-all">{lang === "fr" ? "Certifier la Réservation de Session" : "Certify Session Booking"}</button>
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
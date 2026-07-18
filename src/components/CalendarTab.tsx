import React, { useState } from 'react';
import { useSchoolData } from '../context/SchoolDataContext';
import { Calendar, AlertTriangle, Pin, Filter, Bell, Clock, MapPin, ChevronDown, ChevronUp, Plus, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export default function CalendarTab() {
  const { announcements, events, addAnnouncement, addEvent, spreadsheetId, isAdmin } = useSchoolData();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [expandedAnnId, setExpandedAnnId] = useState<string | null>(announcements[0]?.id || null);

  // Admin form states
  const [showAdminForm, setShowAdminForm] = useState<'none' | 'ann' | 'ev'>('none');
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<'Urgent' | 'Akademik' | 'Kegiatan' | 'Pengumuman'>('Pengumuman');
  const [annContent, setAnnContent] = useState('');
  const [annPinned, setAnnPinned] = useState(false);

  const [evTitle, setEvTitle] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evTime, setEvTime] = useState('');
  const [evLocation, setEvLocation] = useState('');
  const [evDesc, setEvDesc] = useState('');

  const [adminSuccess, setAdminSuccess] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Semua', 'Urgent', 'Akademik', 'Kegiatan', 'Pengumuman'];

  const filteredAnnouncements = announcements.filter(ann => {
    if (selectedCategory === 'Semua') return true;
    return ann.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Helper for Category color classes
  const getCategoryStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case 'urgent':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'akademik':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'kegiatan':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Helper to format date label
  const formatDateString = (dateStr: string) => {
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const handleAddAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) {
      setAdminError('Harap lengkapi semua kolom pengumuman.');
      return;
    }
    setAdminError('');
    setAdminSuccess('');
    setIsSubmitting(true);
    try {
      await addAnnouncement({
        title: annTitle.trim(),
        category: annCategory,
        content: annContent.trim(),
        date: new Date().toISOString().split('T')[0],
        isPinned: annPinned
      });
      setAnnTitle('');
      setAnnContent('');
      setAnnPinned(false);
      setAdminSuccess('Pengumuman baru berhasil ditambahkan!');
      setShowAdminForm('none');
      // Auto clear success
      setTimeout(() => setAdminSuccess(''), 5000);
    } catch (err: any) {
      setAdminError('Gagal menambahkan pengumuman ke database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle.trim() || !evDate.trim() || !evTime.trim()) {
      setAdminError('Harap lengkapi kolom Judul, Tanggal, dan Waktu.');
      return;
    }
    setAdminError('');
    setAdminSuccess('');
    setIsSubmitting(true);
    try {
      await addEvent({
        title: evTitle.trim(),
        date: evDate.trim(),
        time: evTime.trim(),
        location: evLocation.trim() || 'SD Negeri Cerdas Bangsa',
        description: evDesc.trim()
      });
      setEvTitle('');
      setEvDate('');
      setEvTime('');
      setEvLocation('');
      setEvDesc('');
      setAdminSuccess('Agenda kegiatan baru berhasil ditambahkan!');
      setShowAdminForm('none');
      // Auto clear success
      setTimeout(() => setAdminSuccess(''), 5000);
    } catch (err: any) {
      setAdminError('Gagal menambahkan agenda kegiatan ke database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="calendar-tab-view" className="space-y-6">
      {/* Admin Operations Panel - Shown only when logged in as Admin */}
      {isAdmin && (
        <div className="bg-slate-800 text-white p-5 rounded-3xl shadow-sm border border-slate-700 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h4 className="font-bold text-sm flex items-center gap-2 text-amber-300">
                <Settings className="w-4 h-4 animate-spin-slow" /> Mode Portal Administrator
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {spreadsheetId ? "Koneksi Google Sheets Aktif (Sinkron Live)" : "Mode Lokal (Belum Terhubung Sheets)"} • Tambah pengumuman atau agenda rapat/kegiatan sekolah.
              </p>
            </div>
            
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => {
                  setShowAdminForm(showAdminForm === 'ann' ? 'none' : 'ann');
                  setAdminError('');
                  setAdminSuccess('');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  showAdminForm === 'ann' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                <Plus className="w-3.5 h-3.5" /> Pengumuman
              </button>
              <button
                onClick={() => {
                  setShowAdminForm(showAdminForm === 'ev' ? 'none' : 'ev');
                  setAdminError('');
                  setAdminSuccess('');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  showAdminForm === 'ev' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                <Plus className="w-3.5 h-3.5" /> Agenda Kegiatan
              </button>
            </div>
          </div>

          {/* Success / Error Messages */}
          {adminSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-xl">
              {adminSuccess}
            </div>
          )}
          {adminError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl">
              {adminError}
            </div>
          )}

          {/* Form 1: Add Announcement */}
          {showAdminForm === 'ann' && (
            <form onSubmit={handleAddAnn} className="bg-slate-900/40 p-4 rounded-2xl border border-slate-700/60 space-y-3.5">
              <h5 className="font-bold text-xs text-indigo-300">Tambah Pengumuman Baru</h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Judul Pengumuman</label>
                  <input
                    type="text"
                    placeholder="Contoh: Pengumuman Pembagian Rapor Semester Genap"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    required
                  />
                </div>
                
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-semibold"
                  >
                    <option value="Pengumuman">Pengumuman Umum</option>
                    <option value="Urgent">Urgent / Penting</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Kegiatan">Kegiatan Sekolah</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Isi Pengumuman</label>
                <textarea
                  rows={3}
                  placeholder="Masukkan detail pengumuman yang ingin disampaikan secara lengkap..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={annPinned}
                    onChange={(e) => setAnnPinned(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 bg-slate-800 border-slate-700 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                  />
                  <span>Sematkan di Atas (Pin Announcement)</span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Menyimpan..." : "Posting Pengumuman"}
                </button>
              </div>
            </form>
          )}

          {/* Form 2: Add Event */}
          {showAdminForm === 'ev' && (
            <form onSubmit={handleAddEv} className="bg-slate-900/40 p-4 rounded-2xl border border-slate-700/60 space-y-3.5">
              <h5 className="font-bold text-xs text-indigo-300">Tambah Agenda Kegiatan Terdekat</h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Judul Agenda</label>
                  <input
                    type="text"
                    placeholder="Contoh: Rapat Komite Bulanan"
                    value={evTitle}
                    onChange={(e) => setEvTitle(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Agenda</label>
                  <input
                    type="date"
                    value={evDate}
                    onChange={(e) => setEvDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Waktu / Jam</label>
                  <input
                    type="text"
                    placeholder="Contoh: 08:00 - 10:00 WIB"
                    value={evTime}
                    onChange={(e) => setEvTime(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lokasi Kegiatan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ruang Serbaguna Sekolah"
                    value={evLocation}
                    onChange={(e) => setEvLocation(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deskripsi Singkat</label>
                  <input
                    type="text"
                    placeholder="Masukkan keterangan tambahan atau catatan rapat..."
                    value={evDesc}
                    onChange={(e) => setEvDesc(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Menyimpan..." : "Tambah Agenda"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Main Grid Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Announcements Column (8/12) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-500" /> Papan Pengumuman
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Informasi penting, sosialisasi, dan pemberitahuan berkala sekolah.</p>
          </div>
          
          {/* Category Pill Filters */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all duration-150 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Announcements Stack */}
        <div className="space-y-3">
          {filteredAnnouncements.map((ann) => {
            const isExpanded = expandedAnnId === ann.id;
            return (
              <motion.div
                key={ann.id}
                layoutId={`ann-${ann.id}`}
                className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all duration-200 ${
                  ann.isPinned ? 'border-amber-200/80 bg-amber-50/10' : 'border-slate-100'
                }`}
              >
                {/* Header click triggers expand */}
                <div
                  onClick={() => setExpandedAnnId(isExpanded ? null : ann.id)}
                  className="p-5 flex items-start gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-md text-center ${getCategoryStyles(ann.category)}`}>
                      {ann.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 text-center font-medium">
                      {formatDateString(ann.date)}
                    </span>
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5">
                      {ann.isPinned && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-md border border-amber-200">
                          <Pin className="w-2.5 h-2.5" /> PINNED
                        </span>
                      )}
                      <h4 className="font-bold text-slate-800 text-sm leading-tight hover:text-indigo-600 transition-colors">
                        {ann.title}
                      </h4>
                    </div>
                    
                    {!isExpanded && (
                      <p className="text-xs text-slate-500 line-clamp-1 leading-normal">
                        {ann.content}
                      </p>
                    )}
                  </div>

                  <div className="text-slate-400 shrink-0 self-center">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-50 text-xs text-slate-600 leading-relaxed space-y-4">
                    <p>{ann.content}</p>
                    
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[10px] text-slate-400">
                      <span>SD Negeri Cerdas Bangsa • Pusat Komunikasi & Informasi</span>
                      <span>Diterbitkan: {formatDateString(ann.date)}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}

          {filteredAnnouncements.length === 0 && (
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl text-center">
              <p className="text-xs text-slate-400 font-semibold">Tidak ada pengumuman untuk kategori "{selectedCategory}".</p>
            </div>
          )}
        </div>
      </div>

      {/* Agenda & Event Calendar Column (4/12) */}
      <div className="lg:col-span-5 space-y-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" /> Agenda Kegiatan Terdekat
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Jadwal kegiatan akademik & sosial penting sekolah terdekat.</p>
        </div>

        {/* Events list */}
        <div className="space-y-3">
          {events.map((ev, idx) => {
            // Parse event day and month
            const d = new Date(ev.date);
            const eventDay = d.getDate();
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
            const eventMonth = months[d.getMonth()];

            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex gap-4 hover:border-indigo-100 hover:shadow-md transition-all duration-200"
              >
                {/* Date highlight block */}
                <div className="w-14 h-16 rounded-xl bg-gradient-to-b from-indigo-50 to-indigo-100/50 border border-indigo-100 flex flex-col items-center justify-center text-indigo-800 shrink-0 shadow-inner">
                  <span className="text-xl font-black leading-none">{eventDay}</span>
                  <span className="text-[9px] font-black tracking-widest mt-0.5">{eventMonth}</span>
                </div>

                {/* Event Description */}
                <div className="space-y-1.5 flex-1">
                  <h4 className="font-bold text-slate-800 text-xs md:text-sm leading-snug">{ev.title}</h4>
                  
                  <div className="flex flex-col gap-1 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[200px]">{ev.location}</span>
                    </div>
                  </div>

                  <p className="text-[10px] leading-normal text-slate-400 border-t border-slate-50 pt-1.5 mt-1 font-medium">
                    {ev.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
  );
}

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GoogleSheetsPanel from './components/GoogleSheetsPanel';
import StatsGrid from './components/StatsGrid';
import ProfileTab from './components/ProfileTab';
import DataTab from './components/DataTab';
import CalendarTab from './components/CalendarTab';
import CurriculumTab from './components/CurriculumTab';
import ContactTab from './components/ContactTab';
import AppScriptTab from './components/AppScriptTab';
import { useSchoolData } from './context/SchoolDataContext';
import { Landmark, Users, Calendar as CalendarIcon, BookOpen, Send, Terminal, Lock, Unlock, ShieldAlert, X, KeyRound, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TabType = 'profile' | 'data' | 'calendar' | 'curriculum' | 'contact' | 'appscript';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const { isAdmin, loginAdmin, logoutAdmin, spreadsheetId } = useSchoolData();
  
  // Guard: if non-admin somehow ends up on 'appscript', redirect to 'profile'
  useEffect(() => {
    if (!isAdmin && activeTab === 'appscript') {
      setActiveTab('profile');
    }
  }, [isAdmin, activeTab]);

  // Login modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!passwordInput.trim()) {
      setLoginError('Sandi tidak boleh kosong');
      return;
    }
    const success = await loginAdmin(passwordInput);
    if (success) {
      setPasswordInput('');
      setShowLoginModal(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    } else {
      setLoginError('Sandi admin salah! Coba "admin123" atau "cerdas123"');
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profil Sekolah', icon: Landmark, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { id: 'data' as TabType, label: 'Rombel & Guru', icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { id: 'calendar' as TabType, label: 'Agenda & Pengumuman', icon: CalendarIcon, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { id: 'curriculum' as TabType, label: 'Kurikulum & Ekskul', icon: BookOpen, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { id: 'contact' as TabType, label: 'Kontak & Buku Tamu', icon: Send, color: 'text-rose-600 bg-rose-50 border-rose-100' },
    ...(isAdmin ? [{ id: 'appscript' as TabType, label: 'Apps Script', icon: Terminal, color: 'text-amber-600 bg-amber-50 border-amber-100' }] : []),
  ];

  return (
    <div id="main-app-container" className="min-h-screen bg-slate-50/60 text-slate-800 font-sans antialiased pb-12">
      
      {/* Administrative Top Quick Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-400">Portal Resmi SD Negeri Cerdas Bangsa</span>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 flex items-center gap-1 text-[10px]">
                  <Unlock className="w-2.5 h-2.5" /> MODE ADMIN AKTIF
                </span>
                <button 
                  onClick={logoutAdmin}
                  className="hover:text-white transition-colors cursor-pointer font-bold border-l border-slate-700 pl-3 flex items-center gap-1 py-0.5"
                >
                  Keluar Admin
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setLoginError('');
                  setShowLoginModal(true);
                }}
                className="hover:text-amber-400 transition-colors flex items-center gap-1 font-bold cursor-pointer text-slate-400"
              >
                <Lock className="w-3 h-3 text-amber-500" /> Login Admin Sekolah
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* Portal Header */}
        <Header />

        {/* Google Sheets Live Database Connection Center - Hidden from public, visible only to logged-in Admin */}
        {isAdmin && <GoogleSheetsPanel />}
        
        {/* Dynamic Statistics cards */}
        <StatsGrid />
        
        {/* Tab switcher buttons - Segmented clean layout */}
        <div id="tab-navigation-bar" className="flex flex-wrap gap-2 p-1.5 bg-white border border-slate-100 rounded-3xl shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold rounded-2xl transition-all duration-200 grow sm:grow-0 justify-center cursor-pointer ${
                  isActive
                    ? `${tab.color} shadow-sm border`
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/80 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? '' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Tab content with smooth transition */}
        <div id="tab-content-panel" className="bg-slate-50 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'profile' && <ProfileTab />}
              {activeTab === 'data' && <DataTab />}
              {activeTab === 'calendar' && <CalendarTab />}
              {activeTab === 'curriculum' && <CurriculumTab />}
              {activeTab === 'contact' && <ContactTab />}
              {activeTab === 'appscript' && <AppScriptTab />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="pt-6 border-t border-slate-200/50 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>SD Negeri Cerdas Bangsa • Akreditasi A • NPSN: 20103245</span>
          </div>
          <div className="text-center sm:text-right">
            © 2026 Portal Informasi Sekolah Terpadu. All rights reserved.
          </div>
        </footer>

      </div>

      {/* ADMIN LOGIN DIALOG MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 w-full max-w-sm text-xs space-y-4 relative"
            >
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col items-center text-center space-y-2 pt-2">
                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-100 text-amber-600">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm">Masuk Portal Administrator</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
                  Silakan masukkan sandi admin sekolah untuk membuka panel pengaturan database, mading, dan manipulasi data.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block uppercase tracking-wider text-[9px]">Sandi Admin</label>
                  <input 
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Masukkan sandi..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                    autoFocus
                  />
                </div>

                {loginError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-semibold flex items-start gap-1.5 text-[10px]">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl border border-slate-200 cursor-pointer text-center"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer text-center shadow-md transition-colors"
                  >
                    Verifikasi
                  </button>
                </div>
              </form>

              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center text-slate-400 text-[10px] font-medium leading-relaxed">
                Petunjuk Cepat: Sandi default adalah <strong className="text-slate-600 font-extrabold">"admin123"</strong> atau <strong className="text-slate-600 font-extrabold">"cerdas123"</strong>.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LOGIN SUCCESS TOAST */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-5 right-5 bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl shadow-xl z-50 text-xs font-semibold flex items-center gap-2.5"
          >
            <div className="p-1 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-extrabold text-slate-200">Login Berhasil!</p>
              <p className="text-[10px] text-slate-400 font-medium">Anda sekarang berada dalam mode Administrasi Sekolah.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

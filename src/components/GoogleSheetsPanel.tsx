import React, { useState } from 'react';
import { useSchoolData } from '../context/SchoolDataContext';
import { Database, FileSpreadsheet, RefreshCw, LogIn, LogOut, ExternalLink, Link2, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GoogleSheetsPanel() {
  const {
    user,
    spreadsheetId,
    isSyncing,
    signIn,
    signOut,
    createNewSpreadsheet,
    connectSpreadsheet,
    syncData,
    error,
    clearError
  } = useSchoolData();

  const [isOpen, setIsOpen] = useState(false);
  const [inputSheetId, setInputSheetId] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSheetId.trim()) return;
    setLocalError(null);
    setIsConnecting(true);
    try {
      await connectSpreadsheet(inputSheetId.trim());
      setInputSheetId('');
    } catch (err: any) {
      setLocalError("ID Spreadsheet tidak valid atau tidak memiliki akses. Pastikan Anda telah memberikan akses spreadsheets.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCreateNew = async () => {
    setLocalError(null);
    setIsCreating(true);
    try {
      await createNewSpreadsheet();
    } catch (err: any) {
      setLocalError("Gagal membuat Google Sheets baru. Coba lagi.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div id="google-sheets-panel-container" className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden mb-6">
      {/* Header Bar */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${spreadsheetId ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              Database Google Sheets
              {spreadsheetId ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200">
                  Offline (Static)
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {spreadsheetId 
                ? "Portal tersinkronisasi secara langsung dengan Google Sheets Anda" 
                : "Masuk dengan Google untuk menyinkronkan pengumuman, agenda, statistik, dan buku tamu"}
            </p>
          </div>
        </div>
        
        <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl cursor-pointer transition-colors">
          {isOpen ? "Sembunyikan" : "Kelola Koneksi"}
        </button>
      </div>

      {/* Expandable Content Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-slate-100 bg-slate-50/30"
          >
            <div className="p-5 space-y-4 text-xs">
              {/* Errors Displays */}
              {(error || localError) && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 font-semibold rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p>{error || localError}</p>
                    <button 
                      onClick={() => { clearError(); setLocalError(null); }}
                      className="text-xs text-rose-600 underline font-bold mt-1 cursor-pointer hover:text-rose-800"
                    >
                      Tutup Pesan Error
                    </button>
                  </div>
                </div>
              )}

              {!user ? (
                /* STEP 1: LOGIN REQUIRED */
                <div className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1.5 text-center md:text-left">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 justify-center md:justify-start">
                      <LogIn className="w-4 h-4 text-blue-500" /> Masuk ke Akun Google Anda
                    </h4>
                    <p className="text-slate-500 max-w-xl leading-relaxed">
                      Kami memerlukan izin untuk menyimpan data sekolah dan aspirasi buku tamu langsung ke spreadsheet di Google Drive Anda. Semua data aman dan sepenuhnya di bawah kontrol Anda.
                    </p>
                  </div>
                  
                  {/* Google Custom Styled Button */}
                  <button 
                    onClick={signIn}
                    className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-all duration-150 shrink-0 cursor-pointer text-xs"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.77-.3-1.45-.73-1.84-1.22z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Masuk dengan Google</span>
                  </button>
                </div>
              ) : (
                /* STEP 2: CONNECTED TO USER - CHOOSE SPREADSHEET */
                <div className="space-y-4">
                  {/* Active Google Session Details */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      {user.photoURL ? (
                        <img referrerPolicy="no-referrer" src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-slate-100" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700">
                          {user.displayName ? user.displayName[0] : 'U'}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-800 leading-none">{user.displayName || 'Akun Google Connected'}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{user.email}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={signOut}
                      className="flex items-center gap-1.5 text-[10px] bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" /> Keluar Akun
                    </button>
                  </div>

                  {spreadsheetId ? (
                    /* CASE 2A: SPREADSHEET ACTIVE */
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Connected Details Block */}
                      <div className="md:col-span-8 bg-white border border-slate-100 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-emerald-700 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Sinkronisasi Aktif
                          </h4>
                          <p className="text-slate-500 leading-normal">
                            Portal ini berhasil terhubung ke Google Spreadsheet Anda. Semua data pengumuman, agenda kegiatan, statistik sekolah, dan masukan tamu disinkronkan secara real-time.
                          </p>
                          <div className="pt-1.5 flex items-center gap-1 bg-slate-50 p-2 rounded-xl border border-slate-100 font-mono text-[9px] text-slate-500 overflow-x-auto">
                            <span className="font-bold text-slate-700 shrink-0">Spreadsheet ID:</span>
                            <span className="truncate">{spreadsheetId}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <a 
                            href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Buka di Google Sheets
                          </a>
                          
                          <button 
                            onClick={syncData}
                            disabled={isSyncing}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl shadow-sm transition-all duration-150 cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Info & Schema Guide */}
                      <div className="md:col-span-4 bg-blue-50/50 border border-blue-100/60 p-5 rounded-2xl space-y-2.5">
                        <h5 className="font-bold text-blue-800 text-xs flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-blue-500" /> Panduan Edit Data
                        </h5>
                        <p className="text-blue-900 leading-normal text-[11px]">
                          Anda dapat mengubah data langsung di Google Sheets Anda! Lembar kerja memiliki 4 tab:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-blue-950 font-medium text-[10px]">
                          <li><strong>Statistik</strong>: Total siswa, guru, rombel</li>
                          <li><strong>Pengumuman</strong>: Informasi papan mading</li>
                          <li><strong>Agenda</strong>: Tanggal upacara & rapat</li>
                          <li><strong>Buku Tamu</strong>: Pesan aspirasi terkirim</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    /* CASE 2B: USER CONNECTED BUT NO SPREADSHEET */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Action 1: Create Spreadsheet automatically */}
                      <div className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col justify-between items-start space-y-4">
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                            <FileSpreadsheet className="w-4 h-4 text-indigo-500" /> Buat Database Baru Otomatis
                          </h4>
                          <p className="text-slate-500 leading-relaxed">
                            Pilihan tercepat! Klik di bawah untuk membuat file spreadsheet baru bernama <strong>"SD Negeri Cerdas Bangsa - Portal Database"</strong> di Google Drive Anda, lengkap dengan contoh data bawaan.
                          </p>
                        </div>
                        
                        <button
                          onClick={handleCreateNew}
                          disabled={isCreating}
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-100 cursor-pointer disabled:opacity-50 transition-colors"
                        >
                          {isCreating ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Membuat Spreadsheet...</span>
                            </>
                          ) : (
                            <>
                              <FileSpreadsheet className="w-4 h-4" />
                              <span>Buat Database Baru</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Action 2: Connect Existing Spreadsheet */}
                      <div className="bg-white border border-slate-100 p-5 rounded-2xl flex flex-col justify-between items-start space-y-4">
                        <div className="space-y-1.5 w-full">
                          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                            <Link2 className="w-4 h-4 text-indigo-500" /> Sambungkan Spreadsheet yang Ada
                          </h4>
                          <p className="text-slate-500 leading-relaxed">
                            Sudah memiliki database spreadsheet sekolah di Google Drive? Tempelkan ID Spreadsheet tersebut di bawah ini untuk menyambungkannya.
                          </p>
                          
                          <form onSubmit={handleConnect} className="flex gap-2 pt-2 w-full">
                            <input 
                              type="text" 
                              placeholder="ID Spreadsheet (dari URL Google Sheets)"
                              value={inputSheetId}
                              onChange={(e) => setInputSheetId(e.target.value)}
                              className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                            <button
                              type="submit"
                              disabled={isConnecting || !inputSheetId.trim()}
                              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-40"
                            >
                              {isConnecting ? "Menghubungkan..." : "Hubungkan"}
                            </button>
                          </form>
                        </div>

                        <p className="text-[10px] text-slate-400 font-medium">
                          ID Spreadsheet adalah rangkaian panjang huruf dan angka di dalam link spreadsheet: <br />
                          docs.google.com/spreadsheets/d/<span className="text-slate-600 font-bold bg-slate-100 px-1 py-0.5 rounded">SPREADSHEET_ID</span>/edit
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

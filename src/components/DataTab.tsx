import { useState } from 'react';
import { classesData, teachersData } from '../data/schoolData';
import { Users, GraduationCap, Search, CheckCircle, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function DataTab() {
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'teachers'>('roster');
  const [selectedClassId, setSelectedClassId] = useState<string>('1a');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentClass = classesData.find(c => c.id === selectedClassId) || classesData[0];

  // Filtering teachers based on search query
  const filteredTeachers = teachersData.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subjects.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // SVG Chart calculation for Class Population
  // We can calculate total students per grade (combining A and B)
  const gradeSummary = [1, 2, 3, 4, 5, 6].map(grade => {
    const gradeClasses = classesData.filter(c => c.className.startsWith(`Kelas ${grade}`));
    const male = gradeClasses.reduce((sum, c) => sum + c.maleCount, 0);
    const female = gradeClasses.reduce((sum, c) => sum + c.femaleCount, 0);
    return {
      grade: `Kls ${grade}`,
      male,
      female,
      total: male + female,
    };
  });

  const maxTotal = Math.max(...gradeSummary.map(g => g.total));

  return (
    <div id="data-tab-view" className="space-y-6">
      {/* Sub-tab selection */}
      <div className="flex border-b border-slate-100 pb-0.5 gap-6">
        <button
          onClick={() => { setActiveSubTab('roster'); setSearchQuery(''); }}
          className={`pb-3 font-bold text-sm tracking-tight relative transition-all duration-200 ${
            activeSubTab === 'roster' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Rombongan Belajar & Siswa
          {activeSubTab === 'roster' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
        <button
          onClick={() => { setActiveSubTab('teachers'); setSearchQuery(''); }}
          className={`pb-3 font-bold text-sm tracking-tight relative transition-all duration-200 ${
            activeSubTab === 'teachers' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Direktori Guru & Staf
          {activeSubTab === 'teachers' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>

      {activeSubTab === 'roster' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Class Selector Side panel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-500" /> Pilih Kelas
              </h4>
              <p className="text-xs text-slate-400 leading-normal">
                Pilih rombel di bawah untuk melihat rincian wali kelas, sebaran siswa, dan nama siswa aktif.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 pt-2">
                {classesData.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClassId(c.id)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all duration-150 text-left ${
                      selectedClassId === c.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100'
                        : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200'
                    }`}
                  >
                    <div>{c.className}</div>
                    <div className={`text-[10px] mt-0.5 font-semibold ${selectedClassId === c.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {c.maleCount + c.femaleCount} Murid
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Summary Statistic Banner */}
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-5 rounded-3xl shadow-sm space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-300">Rasio Kelas Nyaman</h5>
              <p className="text-sm font-medium text-indigo-100 leading-normal">
                Sesuai standar pelayanan minimum Kemendikbud, rasio murid di SDN Cerdas Bangsa dijaga maksimal 28-30 siswa per kelas demi kenyamanan belajar mengajar.
              </p>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl text-xs font-bold border border-white/10">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Rata-rata Kelas: 28.5 Murid</span>
              </div>
            </div>
          </div>

          {/* Class Details stage */}
          <div className="lg:col-span-8 space-y-6">
            {/* Class overview card */}
            <motion.div
              key={selectedClassId}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-50 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{currentClass.className}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Wali Kelas: <strong className="text-blue-600 font-semibold">{currentClass.homeroomTeacher}</strong></p>
                </div>
                <div className="flex gap-2">
                  <div className="bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl text-center">
                    <div className="text-xs font-bold text-blue-800">{currentClass.maleCount}</div>
                    <div className="text-[9px] text-blue-500 font-bold uppercase tracking-wider">Laki-laki</div>
                  </div>
                  <div className="bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl text-center">
                    <div className="text-xs font-bold text-rose-800">{currentClass.femaleCount}</div>
                    <div className="text-[9px] text-rose-500 font-bold uppercase tracking-wider">Perempuan</div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl text-center">
                    <div className="text-xs font-bold text-emerald-800">{currentClass.maleCount + currentClass.femaleCount}</div>
                    <div className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Total</div>
                  </div>
                </div>
              </div>

              {/* Students Grid list */}
              <div>
                <h4 className="font-bold text-slate-700 text-xs mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-blue-500" /> Daftar Contoh Siswa Aktif
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentClass.students.map((student, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-inner transition-all duration-150">
                      <span className="w-6 h-6 rounded-lg bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-700">{student}</span>
                      <span className="ml-auto text-[10px] font-medium text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-md">
                        Siswa Aktif
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Custom SVG Distribution Chart per Grade */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Grafik Sebaran Siswa per Angkatan</h4>
                <p className="text-xs text-slate-400 mt-0.5">Statistik jumlah gabungan murid laki-laki & perempuan dari kelas A & B per jenjang.</p>
              </div>

              {/* Chart implementation */}
              <div className="space-y-3 pt-2">
                {gradeSummary.map((gradeInfo, index) => {
                  const percent = (gradeInfo.total / maxTotal) * 100;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700">{gradeInfo.grade}</span>
                        <div className="flex gap-3 text-[10px] font-semibold text-slate-500">
                          <span>L: {gradeInfo.male}</span>
                          <span>P: {gradeInfo.female}</span>
                          <span className="text-blue-600 font-bold">Total: {gradeInfo.total}</span>
                        </div>
                      </div>
                      
                      {/* Custom Progress Bar Chart */}
                      <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden flex relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center px-2 shadow-inner"
                        />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-900 drop-shadow-sm">
                          {Math.round(percent)}% Kapasitas Rombel
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Teachers list view
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Roster Guru & Tenaga Kependidikan</h3>
              <p className="text-xs text-slate-400 mt-0.5">Informasi NIP, jabatan, mata pelajaran yang diampu, serta email operasional guru.</p>
            </div>
            
            {/* Search filter input */}
            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari guru, jabatan, mapel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTeachers.map((teacher, idx) => (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-blue-100 transition-all duration-150"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shrink-0">
                      {teacher.name.split(' ').filter(n => !n.startsWith('Drs.') && !n.startsWith('Dra.') && !n.startsWith('H.') && !n.startsWith('Hj.')).map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-sm">{teacher.name}</h4>
                      <p className="text-[11px] font-semibold text-blue-600">{teacher.role}</p>
                      <p className="text-[10px] text-slate-400 font-mono">NIP. {teacher.nip}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((sub, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 text-[9px] font-semibold bg-slate-50 text-slate-600 rounded-md border border-slate-100">
                          {sub}
                        </span>
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between mt-1">
                      <span>Email Kontak:</span>
                      <a href={`mailto:${teacher.email}`} className="text-blue-600 font-bold hover:underline">{teacher.email}</a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl text-center flex flex-col items-center justify-center space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400" />
              <p className="text-sm font-bold text-slate-600">Guru atau Staff tidak ditemukan</p>
              <p className="text-xs text-slate-400">Silakan coba dengan kata kunci pencarian guru lain.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

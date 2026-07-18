import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Grid, Trophy, Sparkles, Settings, Save, X } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { motion, AnimatePresence } from 'motion/react';

export default function StatsGrid() {
  const { stats, updateStats, isAdmin, spreadsheetId } = useSchoolData();
  const [isEditing, setIsEditing] = useState(false);
  const [studentsInput, setStudentsInput] = useState(stats.totalStudents);
  const [teachersInput, setTeachersInput] = useState(stats.totalTeachers);
  const [classesInput, setClassesInput] = useState(stats.totalClasses);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync inputs with state when stats load/change
  useEffect(() => {
    setStudentsInput(stats.totalStudents);
    setTeachersInput(stats.totalTeachers);
    setClassesInput(stats.totalClasses);
  }, [stats]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateStats({
        ...stats,
        totalStudents: Number(studentsInput),
        totalTeachers: Number(teachersInput),
        totalClasses: Number(classesInput),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const statsList = [
    {
      id: 'stat-students',
      label: 'Total Siswa Aktif',
      value: stats.totalStudents,
      subtext: 'L: 172 • P: 170 siswa',
      icon: Users,
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      iconBg: 'bg-emerald-500 text-white',
    },
    {
      id: 'stat-teachers',
      label: 'Guru & Tenaga Pendidik',
      value: stats.totalTeachers,
      subtext: '100% Sertifikasi Layak',
      icon: GraduationCap,
      bgColor: 'bg-blue-50 text-blue-700 border-blue-100',
      iconBg: 'bg-blue-500 text-white',
    },
    {
      id: 'stat-classes',
      label: 'Rombongan Belajar (Rombel)',
      value: stats.totalClasses,
      subtext: 'Kelas 1 s.d 6 (A/B)',
      icon: Grid,
      bgColor: 'bg-amber-50 text-amber-700 border-amber-100',
      iconBg: 'bg-amber-500 text-white',
    },
    {
      id: 'stat-achievements',
      label: 'Prestasi Akademik & Non-Akad',
      value: '24+',
      subtext: 'Tingkat Kota s.d Nasional',
      icon: Trophy,
      bgColor: 'bg-purple-50 text-purple-700 border-purple-100',
      iconBg: 'bg-purple-500 text-white',
    },
  ];

  return (
    <div className="space-y-4 mb-6">
      
      {/* Admin stats settings trigger bar */}
      {isAdmin && (
        <div className="bg-slate-800 text-white p-3.5 px-5 rounded-2xl border border-slate-700 flex justify-between items-center shadow-sm text-xs">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-400 animate-spin-slow" />
            <span className="font-semibold text-slate-200">
              Pengaturan Statistik Sekolah 
              {spreadsheetId && <span className="text-emerald-400 font-bold ml-1.5">(Terhubung Google Sheets)</span>}
            </span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-[10px] font-bold transition-all cursor-pointer border border-slate-600"
          >
            {isEditing ? 'Sembunyikan Panel' : 'Ubah Data Statistik'}
          </button>
        </div>
      )}

      {/* Expandable editing panel */}
      <AnimatePresence>
        {isEditing && isAdmin && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm overflow-hidden"
          >
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-400 block uppercase tracking-wider text-[9px] font-bold">Total Siswa</label>
                <input
                  type="number"
                  value={studentsInput}
                  onChange={(e) => setStudentsInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 block uppercase tracking-wider text-[9px] font-bold">Total Guru</label>
                <input
                  type="number"
                  value={teachersInput}
                  onChange={(e) => setTeachersInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 block uppercase tracking-wider text-[9px] font-bold">Total Rombel</label>
                <input
                  type="number"
                  value={classesInput}
                  onChange={(e) => setClassesInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-bold"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold cursor-pointer transition-all border border-slate-200 text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold cursor-pointer transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of stats */}
      <div id="school-stats-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsList.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.id}
              id={stat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`p-5 rounded-2xl border flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200 ${stat.bgColor}`}
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {stat.label}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold tracking-tight">
                    {stat.value}
                  </span>
                  {stat.id === 'stat-achievements' && (
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  )}
                </div>
                <p className="text-xs font-medium text-gray-500">
                  {stat.subtext}
                </p>
              </div>
              
              <div className={`p-3 rounded-xl shadow-inner ${stat.iconBg}`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}

import { Landmark, Award, BookOpen, Star, HelpCircle, CheckCircle } from 'lucide-react';
import { schoolProfile } from '../data/schoolData';
import { motion } from 'motion/react';

export default function ProfileTab() {
  const facilities = [
    { name: 'Perpustakaan Pintar', desc: 'Dilengkapi koleksi 5,000+ buku fisik & e-book terpadu.', icon: BookOpen, color: 'bg-indigo-100 text-indigo-700' },
    { name: 'Laboratorium Komputer', desc: '20 unit PC modern dengan koneksi internet ramah anak.', icon: Landmark, color: 'bg-emerald-100 text-emerald-700' },
    { name: 'Lapangan Multi-Olahraga', desc: 'Sarana futsal, basket, voli, dan bulutangkis terintegrasi.', icon: Award, color: 'bg-rose-100 text-rose-700' },
    { name: 'Taman Hidup & P5', desc: 'Laboratorium alam mini untuk budidaya apotek hidup & tanaman hias.', icon: Star, color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div id="profile-tab-view" className="space-y-6">
      {/* Principal Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
      >
        <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-blue-200 flex items-center justify-center mb-4 relative overflow-hidden">
            <span className="text-3xl font-bold text-blue-700">HM</span>
          </div>
          <h4 className="text-base font-bold text-slate-800">{schoolProfile.principalName}</h4>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-1">Kepala Sekolah</p>
          <div className="mt-3 text-[11px] text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-100">
            NIP. 196803121992031005
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center space-y-4">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Sambutan Kepala Sekolah
          </span>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">
            Mendidik dengan Hati, Mencetak Generasi Berprestasi
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed italic">
            "{schoolProfile.principalWelcome}"
          </p>
        </div>
      </motion.div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visi */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100/50 p-6 rounded-3xl shadow-sm space-y-4"
        >
          <span className="px-3 py-1 text-xs font-bold bg-indigo-600 text-white rounded-full">VISI</span>
          <h3 className="text-lg font-bold text-indigo-950">Visi Sekolah</h3>
          <p className="text-base font-medium text-slate-700 leading-relaxed">
            "Terwujudnya insan cerdas, berkarakter mulia, kreatif, dan peduli lingkungan berlandaskan nilai-nilai Pancasila."
          </p>
          <div className="border-t border-indigo-100 pt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-indigo-800">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Cerdas Akademis
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Mulia Berkarakter
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Berwawasan Hijau
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> Berjiwa Pancasila
            </div>
          </div>
        </motion.div>

        {/* Misi */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4"
        >
          <span className="px-3 py-1 text-xs font-bold bg-slate-800 text-white rounded-full">MISI</span>
          <h3 className="text-lg font-bold text-slate-800">Misi Utama</h3>
          <ul className="space-y-3">
            {[
              'Menyelenggarakan pembelajaran aktif, kreatif, ramah anak, dan berbasis teknologi untuk hasil akademik yang optimal.',
              'Menanamkan nilai budi pekerti luhur, budidaya karakter unggul, serta ketakwaan pada Tuhan Yang Maha Esa.',
              'Mengembangkan minat, bakat, potensi seni, olahraga, dan kreativitas siswa dalam wadah ekstrakurikuler dinamis.',
              'Mewujudkan sekolah hijau sehat, pengelolaan lingkungan berkelanjutan, serta budaya memelihara bumi sejak dini.'
            ].map((misi, index) => (
              <li key={index} className="flex gap-3 text-sm text-slate-600">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{misi}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Facilities Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span> Fasilitas Unggulan Sekolah
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className={`p-3 rounded-xl w-fit ${fac.color} mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{fac.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{fac.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

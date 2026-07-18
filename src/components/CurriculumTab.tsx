import { extracurricularsData } from '../data/schoolData';
import { Compass, Activity, Heart, Sparkles, Cpu, Music, BookOpen, Layers, Award, Target } from 'lucide-react';
import { motion } from 'motion/react';

// Icon Map helper
const iconMap: { [key: string]: any } = {
  Compass: Compass,
  Activity: Activity,
  Heart: Heart,
  Sparkles: Sparkles,
  Cpu: Cpu,
  Music: Music,
};

export default function CurriculumTab() {
  const coreSubjects = [
    { name: 'Pendidikan Agama & Budi Pekerti', desc: 'Membangun karakter mulia berbasis nilai iman.' },
    { name: 'Pendidikan Pancasila (PPKn)', desc: 'Menanamkan jiwa nasionalisme & kebhinekaan.' },
    { name: 'Bahasa Indonesia', desc: 'Melatih komunikasi lisan, membaca, & menulis kreatif.' },
    { name: 'Matematika', desc: 'Mengasah pemecahan masalah numerik & logika berhitung.' },
    { name: 'IPAS (IPA & IPS)', desc: 'Ekplorasi gejala alam & sejarah sosial sekitar.' },
    { name: 'Seni & Budaya', desc: 'Menggali kreatifitas rupa, musik, tari, & teater.' },
  ];

  const curriculumFocus = [
    { title: 'Intrakurikuler', desc: 'Kegiatan utama pembelajaran kelas terjadwal terarah.', detail: 'Fokus pada kompetensi dasar kognitif, literasi, numerasi, dan materi kontekstual dengan metode asyik.' },
    { title: 'Projek Profil Pancasila (P5)', desc: 'Projek kolaboratif kokurikuler pembentuk karakter.', detail: 'Belajar di luar kelas bertema Gaya Hidup Berkelanjutan, Kearifan Lokal, Bhineka Tunggal Ika, & Kewirausahaan.' },
    { title: 'Ekstrakurikuler Pilihan', desc: 'Wadah eksplorasi minat, bakat, & potensi unik anak.', detail: 'Diselenggarakan di luar jam sekolah di bawah asuhan mentor profesional di bidang seni, olahraga, sains, & karakter.' },
  ];

  return (
    <div id="curriculum-tab-view" className="space-y-6">
      
      {/* Kurikulum Merdeka Overview Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-50 to-indigo-100/40 p-6 rounded-3xl border border-indigo-100 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
      >
        <div className="space-y-2 max-w-xl">
          <span className="px-3 py-1 text-[10px] font-bold bg-indigo-600 text-white rounded-full">STRUKTUR AKADEMIK</span>
          <h3 className="text-xl font-bold text-indigo-950">Penerapan Kurikulum Merdeka</h3>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
            Kurikulum Merdeka di SDN Cerdas Bangsa dirancang untuk memberikan fleksibilitas pengajaran sesuai tahap perkembangan anak. Kami mengedepankan pembelajaran berdiferensiasi agar setiap potensi anak terakomodasi optimal.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 bg-white p-3 rounded-2xl border border-indigo-100 shadow-sm">
          <div className="text-center px-3 border-r border-slate-100">
            <div className="text-lg font-extrabold text-indigo-700">70%</div>
            <div className="text-[9px] text-slate-400 font-bold uppercase">Teori Kelas</div>
          </div>
          <div className="text-center px-3">
            <div className="text-lg font-extrabold text-indigo-700">30%</div>
            <div className="text-[9px] text-slate-400 font-bold uppercase">Projek P5</div>
          </div>
        </div>
      </motion.div>

      {/* Curriculum Three Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {curriculumFocus.map((pillar, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              <h4 className="font-bold text-slate-800 text-sm">{pillar.title}</h4>
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-600 leading-snug">{pillar.desc}</p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{pillar.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Core Subjects Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span> Struktur Mata Pelajaran Inti
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Berikut daftar mata pelajaran wajib yang diajarkan oleh tim pendidik profesional kami.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreSubjects.map((sub, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-800 text-xs md:text-sm">{sub.name}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{sub.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extracurricular Activities Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span> Pilihan Ekstrakurikuler Unggulan
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Sarana mengasah bakat non-akademik di bidang kepemimpinan, seni, olahraga, dan teknologi.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {extracurricularsData.map((ex, idx) => {
            const Icon = iconMap[ex.iconName] || Target;
            return (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-blue-100 transition-all duration-150"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl shadow-inner">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 rounded-full">
                      {ex.id === 'ex1' ? 'Wajib' : 'Pilihan'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{ex.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{ex.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-50 space-y-1 text-[10px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Pembina / Pelatih:</span>
                    <strong className="text-slate-600 font-semibold">{ex.mentor}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Jadwal Latihan:</span>
                    <strong className="text-indigo-600 font-semibold">{ex.schedule}</strong>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

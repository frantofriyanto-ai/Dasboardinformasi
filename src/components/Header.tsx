import { School, Calendar, ShieldCheck, Landmark } from 'lucide-react';
import { schoolProfile } from '../data/schoolData';
import { useSchoolData } from '../context/SchoolDataContext';
import { motion } from 'motion/react';

export default function Header() {
  const { stats } = useSchoolData();
  const currentDate = new Date('2026-07-15T19:45:34-07:00');
  
  // Format Indonesian Date
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const formattedDate = `${days[currentDate.getDay()]}, ${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  const formattedTime = '19:45 WIB';

  return (
    <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden mb-6">
      {/* Decorative patterns */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute left-1/3 -bottom-12 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl" />
      
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-inner text-white flex items-center justify-center shrink-0"
          >
            <School className="w-10 h-10 text-amber-300" />
          </motion.div>
          
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-400 text-blue-950 rounded-full flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> Akreditasi {stats.accreditation.split(' ')[0]}
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/50 border border-indigo-400/30 text-white rounded-full flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5" /> NPSN: {stats.npsn}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {schoolProfile.name}
            </h1>
            <p className="text-blue-100 text-sm md:text-base font-medium max-w-xl">
              Cerdas • Berkarakter • Peduli Lingkungan • Berlandaskan Pancasila
            </p>
          </div>
        </div>
        
        {/* Right side Info Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-start md:items-end justify-center self-start md:self-auto shadow-sm">
          <div className="flex items-center gap-2 text-amber-200 font-semibold mb-1 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Kalender Akademik</span>
          </div>
          <div className="text-white font-bold text-base md:text-right">
            {formattedDate}
          </div>
          <div className="text-blue-200 text-xs mt-0.5 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Tahun Ajaran 2026/2027 • {formattedTime}
          </div>
        </div>
      </div>
    </header>
  );
}

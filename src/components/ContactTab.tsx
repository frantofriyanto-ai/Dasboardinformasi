import { useState, FormEvent } from 'react';
import { schoolProfile } from '../data/schoolData';
import { GuestbookMessage } from '../types';
import { Phone, Mail, MapPin, Landmark, Send, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';
import { motion, AnimatePresence } from 'motion/react';

export default function ContactTab() {
  const { guestbook, addGuestbookMessage } = useSchoolData();
  const [senderName, setSenderName] = useState('');
  const [role, setRole] = useState<'Orang Tua' | 'Alumni' | 'Siswa' | 'Masyarakat'>('Orang Tua');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!senderName.trim() || !email.trim() || !message.trim()) {
      setError('Harap isi semua kolom formulir.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addGuestbookMessage({
        senderName: senderName.trim(),
        role: role,
        email: email.trim(),
        message: message.trim()
      });
      
      // Reset form
      setSenderName('');
      setEmail('');
      setMessage('');
      setSuccess(true);
      
      // Auto clear success banner
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError('Gagal mengirim masukan ke Google Sheets. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to format date label
  const formatDateTime = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} - ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <div id="contact-tab-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Contact Details & Maps Column */}
      <div className="lg:col-span-5 space-y-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-500" /> Kontak & Lokasi
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Hubungi administrasi sekolah atau kunjungi gedung utama kami.</p>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-4">
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex gap-3">
              <div className="p-2 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl shrink-0">
                <MapPin className="w-4 h-4 text-rose-500" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-700">Alamat Sekolah</p>
                <p className="leading-relaxed">{schoolProfile.address}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="p-2 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl shrink-0">
                <Phone className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-700">Telepon & Fax</p>
                <p className="font-semibold text-slate-800">{schoolProfile.phone}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="p-2 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl shrink-0">
                <Mail className="w-4 h-4 text-blue-500" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-700">Email Operasional</p>
                <a href={`mailto:${schoolProfile.email}`} className="font-semibold text-blue-600 hover:underline">{schoolProfile.email}</a>
              </div>
            </div>
          </div>

          {/* Simulated Map / School Area Photo Widget */}
          <div className="pt-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Denah & Area Sekitar</p>
            <div className="h-44 bg-slate-100 rounded-2xl border border-slate-200/60 relative overflow-hidden flex flex-col justify-center items-center text-center p-4">
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-70" />
              
              <div className="relative z-10 space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center mx-auto shadow-sm">
                  <MapPin className="w-5 h-5 text-blue-600 animate-bounce" />
                </div>
                <h5 className="font-bold text-xs text-slate-700">Peta Digital Sekolah</h5>
                <p className="text-[10px] text-slate-400 max-w-xs leading-normal">
                  Berlokasi strategis di pusat kota, bersebelahan dengan Taman Kota Sukamaju & Perpustakaan Umum Daerah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guestbook and feedback portal (7/12) */}
      <div className="lg:col-span-7 space-y-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-500" /> Buku Tamu & Aspirasi
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Formulir feedback untuk orang tua, alumni, dan masyarakat menyampaikan aspirasi.</p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Terima kasih! Pesan/aspirasi Anda berhasil dikirim ke Buku Tamu.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Cahyono"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-150"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Kontak</label>
                <input
                  type="email"
                  placeholder="budi@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-150"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status / Hubungan</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-150 font-semibold text-slate-700"
                >
                  <option value="Orang Tua">Orang Tua / Wali Siswa</option>
                  <option value="Alumni">Alumni Sekolah</option>
                  <option value="Siswa">Siswa Aktif</option>
                  <option value="Masyarakat">Masyarakat Umum</option>
                </select>
              </div>

              <div className="space-y-1 flex items-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-indigo-100 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Pesan Tamu</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pesan, Saran, atau Aspirasi</label>
              <textarea
                rows={3}
                placeholder="Tuliskan masukan positif atau pertanyaan mengenai SDN Cerdas Bangsa..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-150 resize-none leading-relaxed"
                required
              />
            </div>
          </form>
        </div>

        {/* Message Feed list */}
        <div className="space-y-3.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daftar Aspirasi Terbaru ({guestbook.length})</p>
          
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {guestbook.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm relative group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {msg.senderName ? msg.senderName[0].toUpperCase() : 'T'}
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-xs leading-none">{msg.senderName}</h5>
                        <div className="flex items-center gap-1.5 mt-1 text-[9px] font-semibold text-indigo-600">
                          <UserCheck className="w-3 h-3" />
                          <span>{msg.role}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono text-slate-400 font-medium">
                        {formatDateTime(msg.date)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-3 rounded-xl border border-slate-100/30">
                    "{msg.message}"
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </div>
  );
}

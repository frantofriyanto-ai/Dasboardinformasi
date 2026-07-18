import React, { useState } from 'react';
import { useSchoolData } from '../context/SchoolDataContext';
import { 
  FileSpreadsheet, 
  Code, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  Database, 
  Layers, 
  Play, 
  ChevronRight, 
  Info, 
  HelpCircle,
  Eye,
  Mail,
  Smartphone,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AppScriptTab() {
  const { stats, announcements, events, guestbook, spreadsheetId } = useSchoolData();
  const [activeCodeTab, setActiveCodeTab] = useState<'gs' | 'index' | 'sidebar'>('gs');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  
  // Interactive Simulation states
  const [spreadsheetView, setSpreadsheetView] = useState<'grid' | 'webapp'>('grid');
  const [showSheetMenu, setShowSheetMenu] = useState(false);
  const [showSimSidebar, setShowSimSidebar] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSimModal, setShowSimModal] = useState(false);
  
  // Simulated Web App Data Tab State
  const [simWebTab, setSimWebTab] = useState<'stats' | 'announcements' | 'events' | 'guestbook'>('stats');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const codeGS = `// =========================================================================
// CODE.GS - BACKEND SCRIPT UNTUK DATABASE PORTAL SEKOLAH SD NEGERI CERDAS BANGSA
// =========================================================================

// Menambahkan menu khusus di Google Sheets saat dokumen dibuka
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Portal Sekolah 🏫')
      .addItem('Tampilkan Ringkasan (Sidebar)', 'showSidebar')
      .addItem('Kirim Rekapitulasi Email', 'sendEmailSummary')
      .addSeparator()
      .addItem('Bantuan & Pengaturan', 'showHelpModal')
      .addToUi();
}

// Menampilkan Sidebar Ringkasan di sebelah kanan Google Sheets
function showSidebar() {
  var html = HtmlService.createTemplateFromFile('Sidebar')
      .evaluate()
      .setTitle('Portal Sekolah - Ringkasan')
      .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

// Menampilkan Dialog Bantuan
function showHelpModal() {
  var html = HtmlService.createHtmlOutput(
    '<h3>Panduan Portal Sekolah</h3>' +
    '<p>Selamat! Spreadsheet ini terhubung dengan Portal Sekolah SD Negeri Cerdas Bangsa.</p>' +
    '<p><b>Fitur Apps Script:</b></p>' +
    '<ul>' +
    '<li><b>Menu Portal Sekolah:</b> Mengirim rekapitulasi data dan melihat mading ringkasan.</li>' +
    '<li><b>Web App Dashboard:</b> Menyediakan halaman website dashboard publik gratis berbasis data ini.</li>' +
    '</ul>' +
    '<p>Untuk mempublikasikan Dashboard, klik tombol <b>Deploy &gt; New Deployment</b> di kanan atas, pilih jenis <b>Web App</b>, setel akses ke <b>Anyone</b>, lalu deploy!</p>'
  ).setWidth(400).setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, 'Informasi & Bantuan');
}

// Fungsi utama Web App untuk menyajikan Dashboard publik
function doGet() {
  var html = HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('Dashboard Informasi SD Negeri Cerdas Bangsa')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  return html;
}

// Mengambil seluruh data dari Google Sheet untuk dikonsumsi Web App
function getSchoolData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Ambil Data Statistik
  var statSheet = ss.getSheetByName('Statistik');
  var stats = {
    totalStudents: 342,
    totalTeachers: 18,
    totalClasses: 12,
    accreditation: 'A',
    npsn: '20103245'
  };
  if (statSheet) {
    var vals = statSheet.getRange('A2:B6').getValues();
    vals.forEach(function(row) {
      var key = row[0];
      var val = row[1];
      if (key === 'totalStudents') stats.totalStudents = parseInt(val) || 0;
      else if (key === 'totalTeachers') stats.totalTeachers = parseInt(val) || 0;
      else if (key === 'totalClasses') stats.totalClasses = parseInt(val) || 0;
      else if (key === 'accreditation') stats.accreditation = val;
      else if (key === 'npsn') stats.npsn = val;
    });
  }

  // 2. Ambil Pengumuman
  var annSheet = ss.getSheetByName('Pengumuman');
  var announcements = [];
  if (annSheet) {
    var vals = annSheet.getRange('A2:F100').getValues();
    vals.forEach(function(row, index) {
      if (row[1]) { // Ada judul
        announcements.push({
          id: row[0] || 'ann-sheet-' + index,
          title: row[1],
          date: Utilities.formatDate(new Date(row[2]), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
          category: row[3] || 'Pengumuman',
          content: row[4] || '',
          isPinned: row[5] === true || row[5] === 'TRUE'
        });
      }
    });
  }

  // 3. Ambil Agenda
  var agendaSheet = ss.getSheetByName('Agenda');
  var events = [];
  if (agendaSheet) {
    var vals = agendaSheet.getRange('A2:F100').getValues();
    vals.forEach(function(row, index) {
      if (row[1]) {
        events.push({
          id: row[0] || 'ev-sheet-' + index,
          title: row[1],
          date: Utilities.formatDate(new Date(row[2]), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
          time: row[3] || '08:00 WIB',
          location: row[4] || 'Sekolah',
          description: row[5] || ''
        });
      }
    });
  }

  // 4. Ambil Buku Tamu
  var guestSheet = ss.getSheetByName('Buku Tamu');
  var guestbook = [];
  if (guestSheet) {
    var vals = guestSheet.getRange('A2:F100').getValues();
    vals.forEach(function(row, index) {
      if (row[1]) {
        guestbook.push({
          id: row[0] || 'gb-sheet-' + index,
          senderName: row[1],
          role: row[2] || 'Masyarakat',
          email: row[3] || '',
          message: row[4] || '',
          date: Utilities.formatDate(new Date(row[5]), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm')
        });
      }
    });
  }

  return {
    stats: stats,
    announcements: announcements,
    events: events,
    guestbook: guestbook
  };
}

// Mengirimkan rekapitulasi data sekolah ke email administrator/pengguna
function sendEmailSummary() {
  var data = getSchoolData();
  var recipient = Session.getActiveUser().getEmail();
  
  if (!recipient) {
    recipient = "admin@sekolah.sch.id"; // Fallback email
  }

  var htmlBody = \`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #f8fafc;">
      <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-top: 0;">🏫 Portal SD Negeri Cerdas Bangsa</h2>
      <p style="color: #475569; font-size: 14px;">Berikut adalah laporan ringkasan data sekolah teraktual yang tercatat pada basis data Google Sheets Anda:</p>
      
      <div style="background-color: #ffffff; padding: 18px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
        <h3 style="margin-top: 0; color: #1e293b; font-size: 15px; border-left: 4px solid #10b981; padding-left: 8px;">📈 Statistik Utama</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #64748b;">NPSN:</td><td style="font-weight: bold; text-align: right; color: #0f172a;">\${data.stats.npsn}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Akreditasi:</td><td style="font-weight: bold; text-align: right; color: #0f172a;">\${data.stats.accreditation}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Total Siswa Aktif:</td><td style="font-weight: bold; text-align: right; color: #10b981;">\${data.stats.totalStudents} Siswa</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Total Guru & Pendidik:</td><td style="font-weight: bold; text-align: right; color: #2563eb;">\${data.stats.totalTeachers} Orang</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Rombongan Belajar:</td><td style="font-weight: bold; text-align: right; color: #8b5cf6;">\${data.stats.totalClasses} Rombel</td></tr>
        </table>
      </div>

      <div style="background-color: #ffffff; padding: 18px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
        <h3 style="margin-top: 0; color: #1e293b; font-size: 15px; border-left: 4px solid #3b82f6; padding-left: 8px;">📢 Pengumuman Terbaru (\${data.announcements.length})</h3>
        \${data.announcements.slice(0, 2).map(function(ann) {
          return \`
            <div style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
              <strong style="color: #0f172a; font-size: 13.5px;">\${ann.title}</strong> <span style="font-size: 11px; color: #94a3b8;">(\\u00a0\${ann.date})</span>
              <p style="margin: 4px 0 0 0; font-size: 12.5px; color: #475569;">\${ann.content}</p>
            </div>
          \`;
        }).join('') || '<p style="color: #94a3b8; font-size: 13px;">Tidak ada pengumuman terbaru.</p>'}
      </div>

      <div style="background-color: #ffffff; padding: 18px; border-radius: 12px; border: 1px solid #e2e8f0;">
        <h3 style="margin-top: 0; color: #1e293b; font-size: 15px; border-left: 4px solid #f43f5e; padding-left: 8px;">✍️ Aspirasi / Buku Tamu Terbaru</h3>
        \${data.guestbook.slice(0, 2).map(function(gb) {
          return \`
            <div style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
              <strong style="color: #0f172a; font-size: 13px;">\${gb.senderName}</strong> <span style="font-size: 11px; color: #94a3b8;">-\\u00a0\${gb.role}</span>
              <p style="margin: 4px 0 0 0; font-style: italic; font-size: 12.5px; color: #475569;">"\${gb.message}"</p>
            </div>
          \`;
        }).join('') || '<p style="color: #94a3b8; font-size: 13px;">Tidak ada aspirasi tamu terbaru.</p>'}
      </div>

      <p style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 25px; border-t: 1px solid #e2e8f0; padding-top: 15px;">
        Email rekapitulasi dikirim secara otomatis melalui Google Apps Script dari database Spreadsheet Portal Anda.
      </p>
    </div>
  \`;

  MailApp.sendEmail({
    to: recipient,
    subject: "🏫 Rekap Data & Aspirasi Baru - SD Negeri Cerdas Bangsa",
    htmlBody: htmlBody
  });
}
`;

  const codeIndexHTML = `<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <!-- Load Tailwind CSS untuk styling mading yang responsif dan sangat elegan -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', sans-serif; }
    </style>
  </head>
  <body class="bg-gray-50/60 text-gray-800 min-h-screen pb-12">
    <div class="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      
      <!-- Top Brand Header -->
      <header class="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span class="px-2.5 py-0.5 text-[10px] font-bold bg-amber-400 text-blue-950 rounded-full inline-block mb-2">
            PORTAL WEB PUBLIK • LIVE DATA
          </span>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">SD Negeri Cerdas Bangsa</h1>
          <p class="text-blue-100 text-xs md:text-sm mt-1">Sistem Informasi Publik Real-time berbasis Google Sheets &amp; Apps Script</p>
        </div>
        <div class="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs">
          NPSN: <span class="font-bold text-amber-300" id="head-npsn">20103245</span> • Akreditasi: <span class="font-bold text-amber-300" id="head-accreditation">A</span>
        </div>
      </header>

      <!-- Loading State Overlay -->
      <div id="loading-state" class="text-center py-20 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-3">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p class="text-sm text-gray-400 font-bold">Menghubungkan ke basis data Google Sheets...</p>
      </div>

      <!-- Main Dashboard Content (Hidden initially) -->
      <div id="dashboard-content" class="hidden space-y-6">
        
        <!-- Stats Grid Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Siswa Aktif</span>
              <h3 class="text-3xl font-black text-gray-800 mt-1" id="stat-students-web">...</h3>
              <p class="text-xs text-gray-400 mt-1">Terdiri dari Kelas 1 s.d 6</p>
            </div>
            <div class="p-3 bg-blue-50 text-blue-600 rounded-xl text-2xl">👥</div>
          </div>
          
          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Guru &amp; Pendidik</span>
              <h3 class="text-3xl font-black text-gray-800 mt-1" id="stat-teachers-web">...</h3>
              <p class="text-xs text-gray-400 mt-1">Pendidik Berkompetensi Tinggi</p>
            </div>
            <div class="p-3 bg-green-50 text-green-600 rounded-xl text-2xl">🎓</div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400">Rombongan Belajar</span>
              <h3 class="text-3xl font-black text-gray-800 mt-1" id="stat-classes-web">...</h3>
              <p class="text-xs text-gray-400 mt-1">Fasilitas Kelas Modern &amp; Nyaman</p>
            </div>
            <div class="p-3 bg-purple-50 text-purple-600 rounded-xl text-2xl">🏫</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Announcements Column -->
          <div class="lg:col-span-7 space-y-4">
            <h2 class="text-base font-extrabold text-gray-800 flex items-center gap-2">
              <span>📢 Papan Informasi &amp; Pengumuman</span>
            </h2>
            <div id="announcement-list" class="space-y-3">
              <!-- Rendered dynamically -->
            </div>
          </div>

          <!-- Agenda & Events Column -->
          <div class="lg:col-span-5 space-y-4">
            <h2 class="text-base font-extrabold text-gray-800 flex items-center gap-2">
              <span>📅 Agenda Sekolah Terdekat</span>
            </h2>
            <div id="event-list" class="space-y-3">
              <!-- Rendered dynamically -->
            </div>
          </div>

        </div>

        <!-- Guestbook Messages Wall -->
        <div class="space-y-4">
          <h2 class="text-base font-extrabold text-gray-800 flex items-center gap-2">
            <span>💬 Aspirasi &amp; Buku Tamu</span>
          </h2>
          <div id="guestbook-wall" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Rendered dynamically -->
          </div>
        </div>

      </div>

    </div>

    <script>
      window.onload = function() {
        // Ambil data melalui jembatan google.script.run
        google.script.run.withSuccessHandler(function(data) {
          // 1. Sembunyikan loading, tampilkan dashboard
          document.getElementById('loading-state').classList.add('hidden');
          document.getElementById('dashboard-content').classList.remove('hidden');

          // 2. Set stats & header info
          document.getElementById('head-npsn').innerText = data.stats.npsn;
          document.getElementById('head-accreditation').innerText = data.stats.accreditation;
          document.getElementById('stat-students-web').innerText = data.stats.totalStudents + " Siswa";
          document.getElementById('stat-teachers-web').innerText = data.stats.totalTeachers + " Orang";
          document.getElementById('stat-classes-web').innerText = data.stats.totalClasses + " Rombel";

          // 3. Render Announcements
          var annList = document.getElementById('announcement-list');
          annList.innerHTML = '';
          if (data.announcements && data.announcements.length > 0) {
            data.announcements.forEach(function(ann) {
              var card = document.createElement('div');
              card.className = 'bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2';
              
              var catBadgeStyle = "bg-gray-100 text-gray-700";
              if (ann.category.toLowerCase() === 'urgent') catBadgeStyle = "bg-red-100 text-red-700";
              else if (ann.category.toLowerCase() === 'akademik') catBadgeStyle = "bg-blue-100 text-blue-700";
              else if (ann.category.toLowerCase() === 'kegiatan') catBadgeStyle = "bg-yellow-100 text-yellow-800";

              card.innerHTML = \`
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase \\\${catBadgeStyle}">\\\${ann.category}</span>
                  <span class="text-[10px] font-semibold text-gray-400">\\\${ann.date}</span>
                </div>
                <h4 class="font-extrabold text-gray-800 text-sm md:text-base">\\\${ann.title}</h4>
                <p class="text-xs text-gray-500 leading-relaxed">\\\${ann.content}</p>
                \\\${ann.isPinned ? '<span class="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">📌 Tersemat</span>' : ''}
              \`;
              annList.appendChild(card);
            });
          } else {
            annList.innerHTML = '<div class="bg-white p-6 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">Belum ada pengumuman diterbitkan.</div>';
          }

          // 4. Render Events
          var evList = document.getElementById('event-list');
          evList.innerHTML = '';
          if (data.events && data.events.length > 0) {
            data.events.forEach(function(ev) {
              var card = document.createElement('div');
              card.className = 'bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3';
              
              var dateParts = ev.date.split('-');
              var day = dateParts[2] || '01';
              var monthIndex = parseInt(dateParts[1] || '1') - 1;
              var monthsShort = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
              var month = monthsShort[monthIndex] || 'JAN';

              card.innerHTML = \`
                <div class="w-12 h-12 shrink-0 rounded-lg bg-blue-50 text-blue-700 font-extrabold flex flex-col items-center justify-center text-center">
                  <span class="text-base leading-none font-black">\\\${day}</span>
                  <span class="text-[8px] tracking-wider mt-0.5 font-bold">\\\${month}</span>
                </div>
                <div class="space-y-0.5 overflow-hidden">
                  <h4 class="font-bold text-gray-800 text-xs md:text-sm truncate">\\\${ev.title}</h4>
                  <p class="text-[10px] text-gray-400">\\\${ev.time} • \\\${ev.location}</p>
                  <p class="text-[9px] text-gray-500 italic truncate mt-1">\\\${ev.description}</p>
                </div>
              \`;
              evList.appendChild(card);
            });
          } else {
            evList.innerHTML = '<div class="bg-white p-4 rounded-xl border border-gray-100 text-center text-xs text-gray-400 font-medium">Tidak ada agenda kegiatan terdekat.</div>';
          }

          // 5. Render Guestbook
          var gbWall = document.getElementById('guestbook-wall');
          gbWall.innerHTML = '';
          if (data.guestbook && data.guestbook.length > 0) {
            data.guestbook.slice(0, 6).forEach(function(gb) {
              var card = document.createElement('div');
              card.className = 'bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2';
              card.innerHTML = \`
                <div class="flex justify-between items-center text-xs font-bold text-gray-800">
                  <span>\\\${gb.senderName}</span>
                  <span class="px-2 py-0.5 rounded text-[9px] bg-indigo-50 text-indigo-600 font-extrabold uppercase">\\\${gb.role}</span>
                </div>
                <p class="text-xs text-gray-500 italic leading-relaxed">"\\\${gb.message}"</p>
                <div class="text-[9px] text-gray-400 text-right font-medium">\\\${gb.date}</div>
              \`;
              gbWall.appendChild(card);
            });
          } else {
            gbWall.innerHTML = '<div class="bg-white p-4 rounded-xl border border-gray-100 text-center text-xs text-gray-400 col-span-3">Belum ada pesan buku tamu.</div>';
          }
        }).getSchoolData();
      };
    </script>
  </body>
</html>
`;

  const codeSidebarHTML = `<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <!-- Load Tailwind CSS -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', sans-serif; }
    </style>
  </head>
  <body class="bg-gray-50/50 text-gray-800 p-4">
    <div class="space-y-4">
      
      <!-- Brand Header -->
      <div class="text-center pb-3 border-b border-gray-200">
        <h2 class="font-extrabold text-indigo-600 text-base flex items-center justify-center gap-1.5">
          <span>🏫 Portal Sekolah</span>
        </h2>
        <p class="text-[10px] text-gray-400 mt-0.5">Mading Ringkasan &amp; Utilitas Spreadsheet</p>
      </div>
      
      <!-- Stats Summary Widget -->
      <div class="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm space-y-2">
        <h3 class="font-bold text-[10px] text-gray-400 uppercase tracking-wider">Statistik Sekolah</h3>
        <div class="grid grid-cols-3 gap-1.5 text-center">
          <div class="bg-blue-50/70 p-2 rounded-lg">
            <span class="block text-base font-black text-blue-700" id="stat-students">...</span>
            <span class="text-[8px] text-gray-400 font-bold uppercase">Siswa</span>
          </div>
          <div class="bg-green-50/70 p-2 rounded-lg">
            <span class="block text-base font-black text-green-700" id="stat-teachers">...</span>
            <span class="text-[8px] text-gray-400 font-bold uppercase">Guru</span>
          </div>
          <div class="bg-purple-50/70 p-2 rounded-lg">
            <span class="block text-base font-black text-purple-700" id="stat-classes">...</span>
            <span class="text-[8px] text-gray-400 font-bold uppercase">Rombel</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions Widget -->
      <div class="bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm space-y-2">
        <h3 class="font-bold text-[10px] text-gray-400 uppercase tracking-wider">Utilitas Cepat</h3>
        <button onclick="sendEmail()" class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer">
          <span>📧 Kirim Rekapitulasi Email</span>
        </button>
      </div>

      <!-- Latest Guestbook Entries -->
      <div class="space-y-2">
        <h3 class="font-bold text-[10px] text-gray-400 uppercase tracking-wider">Buku Tamu Terbaru</h3>
        <div id="guestbook-list" class="space-y-2 max-h-48 overflow-y-auto pr-1">
          <p class="text-xs text-gray-400 italic text-center">Memuat...</p>
        </div>
      </div>
    </div>

    <script>
      // Load data on start
      window.onload = function() {
        google.script.run.withSuccessHandler(function(data) {
          document.getElementById('stat-students').innerText = data.stats.totalStudents;
          document.getElementById('stat-teachers').innerText = data.stats.totalTeachers;
          document.getElementById('stat-classes').innerText = data.stats.totalClasses;

          var gbList = document.getElementById('guestbook-list');
          gbList.innerHTML = '';
          if (data.guestbook && data.guestbook.length > 0) {
            data.guestbook.slice(0, 3).forEach(function(gb) {
              var div = document.createElement('div');
              div.className = 'bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-xs space-y-1';
              div.innerHTML = \`
                <div class="flex justify-between font-bold text-gray-700 text-[11px]">
                  <span>\\\${gb.senderName}</span>
                  <span class="text-[8px] text-indigo-600 bg-indigo-50 px-1 rounded">\\\${gb.role}</span>
                </div>
                <p class="text-gray-500 italic text-[10px]">"\\\${gb.message}"</p>
              \`;
              gbList.appendChild(div);
            });
          } else {
            gbList.innerHTML = '<p class="text-xs text-gray-400 italic text-center py-2">Belum ada aspirasi masuk.</p>';
          }
        }).getSchoolData();
      };

      function sendEmail() {
        google.script.run.withSuccessHandler(function() {
          alert('Berhasil! Laporan rekapitulasi data sekolah telah dikirim ke email Anda.');
        }).sendEmailSummary();
      }
    </script>
  </body>
</html>
`;

  const copyToClipboard = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  return (
    <div id="appscript-tab-container" className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-3xl flex flex-col md:flex-row gap-5 items-start">
        <div className="p-3.5 bg-amber-500 text-white rounded-2xl shrink-0">
          <Terminal className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
            Automasi & Web App Google Apps Script
            <span className="px-2 py-0.5 text-[9px] bg-amber-100 text-amber-800 rounded-md font-bold uppercase border border-amber-200">
              Gratis & Tanpa Server
            </span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Google Apps Script memungkinkan Anda mengubah spreadsheet sekolah menjadi <strong>Web App Dashboard publik</strong> yang dinamis dan menambahkan <strong>fitur otomatisasi</strong> (seperti rekapitulasi otomatis ke email dan sidebar rangkuman di Google Sheets).
          </p>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Simulation Mockup (7/12) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Eye className="w-4.5 h-4.5 text-blue-500" /> Simulasi Hasil Apps Script
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Gunakan tab di bawah untuk mencoba fitur Apps Script secara langsung sebelum dipasang.
              </p>
            </div>
            
            {/* View Switcher Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setSpreadsheetView('grid')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  spreadsheetView === 'grid' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Mockup Spreadsheet
              </button>
              <button
                onClick={() => setSpreadsheetView('webapp')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  spreadsheetView === 'webapp' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Mockup Web App
              </button>
            </div>
          </div>

          {/* Interactive Window Sandbox */}
          <div className="bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-800 flex flex-col min-h-[460px]">
            
            {/* Window Browser/App Top Bar */}
            <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-rose-500 rounded-full inline-block"></span>
                <span className="w-3 h-3 bg-amber-500 rounded-full inline-block"></span>
                <span className="w-3 h-3 bg-emerald-500 rounded-full inline-block"></span>
              </div>
              
              <div className="bg-slate-900/60 text-slate-400 text-[10px] font-mono px-3 py-1 rounded-lg border border-slate-700/50 w-2/3 truncate text-center">
                {spreadsheetView === 'grid' 
                  ? '📄 Google Sheets - SD Negeri Cerdas Bangsa - Portal Database'
                  : '🌐 script.google.com/macros/s/AKfycbz_PortalSD/exec'
                }
              </div>
              
              <div className="w-8"></div>
            </div>

            {/* SPREADSHEET MOCKUP VIEW */}
            {spreadsheetView === 'grid' && (
              <div className="bg-slate-100 flex-1 flex relative overflow-hidden text-slate-700 select-none">
                
                {/* Active Sheet Area */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  
                  {/* Google Sheets Header & Custom Menu bar */}
                  <div className="bg-white border-b border-slate-200 px-4 py-2 text-xs flex flex-wrap gap-4 items-center">
                    <span className="font-bold text-emerald-700 text-xs">File</span>
                    <span className="font-medium text-slate-600">Edit</span>
                    <span className="font-medium text-slate-600">Insert</span>
                    <span className="font-medium text-slate-600">Format</span>
                    <span className="font-medium text-slate-600">Extensions</span>
                    
                    {/* CUSTOM TRIGGER MENU ITEM */}
                    <div className="relative">
                      <button 
                        onClick={() => setShowSheetMenu(!showSheetMenu)}
                        className={`px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg flex items-center gap-1 cursor-pointer border border-indigo-100 transition-colors`}
                      >
                        Portal Sekolah 🏫 <span className="text-[8px]">▼</span>
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {showSheetMenu && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-20 text-xs text-slate-700 font-semibold"
                          >
                            <button 
                              onClick={() => {
                                setShowSimSidebar(true);
                                setShowSheetMenu(false);
                                triggerToast("Membuka Sidebar Ringkasan...");
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                            >
                              <span>Tampilkan Ringkasan (Sidebar)</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                            
                            <button 
                              onClick={() => {
                                setShowSheetMenu(false);
                                triggerToast("Memproses data... Mengirim email rekap...");
                                setTimeout(() => {
                                  triggerToast("Laporan rekapitulasi data sekolah berhasil dikirim ke email Anda!");
                                }, 1500);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                            >
                              <span>Kirim Rekapitulasi Email</span>
                              <Mail className="w-3.5 h-3.5 text-indigo-500" />
                            </button>

                            <hr className="my-1 border-slate-100" />
                            
                            <button 
                              onClick={() => {
                                setShowSimModal(true);
                                setShowSheetMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-500 cursor-pointer"
                            >
                              Bantuan &amp; Pengaturan
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Grid Cells content representation */}
                  <div className="flex-1 p-4 overflow-auto font-mono text-[10px] text-slate-500 space-y-4">
                    
                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                      <span className="font-extrabold text-slate-700">Tab: Statistik</span>
                      <table className="w-full text-left border-collapse border border-slate-200">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-1.5 border-r border-slate-200">Kunci (Kolom A)</th>
                            <th className="p-1.5 border-r border-slate-200">Nilai (Kolom B)</th>
                            <th className="p-1.5">Keterangan</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-200">
                            <td className="p-1.5 border-r border-slate-200 font-bold">totalStudents</td>
                            <td className="p-1.5 border-r border-slate-200">{stats.totalStudents}</td>
                            <td className="p-1.5 text-slate-400">Total Siswa Aktif</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-1.5 border-r border-slate-200 font-bold">totalTeachers</td>
                            <td className="p-1.5 border-r border-slate-200">{stats.totalTeachers}</td>
                            <td className="p-1.5 text-slate-400">Guru &amp; Tenaga Pendidik</td>
                          </tr>
                          <tr className="border-b border-slate-200">
                            <td className="p-1.5 border-r border-slate-200 font-bold">totalClasses</td>
                            <td className="p-1.5 border-r border-slate-200">{stats.totalClasses}</td>
                            <td className="p-1.5 text-slate-400">Rombongan Belajar</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-xl">
                      <div className="flex justify-between font-bold text-slate-700 mb-2">
                        <span>Tab: Pengumuman</span>
                        <span className="text-slate-400 font-normal">Menampilkan {announcements.slice(0, 2).length} dari {announcements.length} baris</span>
                      </div>
                      <div className="space-y-1.5 text-[9px] text-slate-500 font-mono">
                        {announcements.slice(0, 2).map((ann, i) => (
                          <div key={i} className="flex gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                            <span className="font-bold text-indigo-600">{ann.category}</span>
                            <span className="truncate flex-1">"{ann.title}"</span>
                            <span className="text-[8px] text-slate-400">{ann.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[10px] text-center text-slate-400 font-sans italic">
                      💡 Klik tombol <strong className="text-indigo-600">Portal Sekolah 🏫</strong> di atas untuk menjalankan automasi Apps Script Anda!
                    </div>

                  </div>
                </div>

                {/* SIDEBAR MOCKUP (Opens when chosen) */}
                <AnimatePresence>
                  {showSimSidebar && (
                    <motion.div
                      initial={{ x: 260 }}
                      animate={{ x: 0 }}
                      exit={{ x: 260 }}
                      className="absolute right-0 top-0 bottom-0 w-64 bg-white border-l border-slate-200 shadow-2xl flex flex-col z-10"
                    >
                      {/* Sidebar Header */}
                      <div className="p-3.5 bg-indigo-600 text-white flex items-center justify-between">
                        <h5 className="font-extrabold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" /> Portal Sekolah Ringkasan
                        </h5>
                        <button 
                          onClick={() => setShowSimSidebar(false)}
                          className="text-[11px] hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Sidebar Content */}
                      <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
                        
                        {/* Stats Widgets */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Statistik Utama</span>
                          <div className="grid grid-cols-3 gap-1 px-1 py-2 bg-slate-50 border border-slate-100 rounded-xl text-center">
                            <div>
                              <span className="block text-base font-black text-blue-600">{stats.totalStudents}</span>
                              <span className="text-[8px] font-bold text-slate-400">SISWA</span>
                            </div>
                            <div>
                              <span className="block text-base font-black text-green-600">{stats.totalTeachers}</span>
                              <span className="text-[8px] font-bold text-slate-400">GURU</span>
                            </div>
                            <div>
                              <span className="block text-base font-black text-purple-600">{stats.totalClasses}</span>
                              <span className="text-[8px] font-bold text-slate-400">ROMBEL</span>
                            </div>
                          </div>
                        </div>

                        {/* Automated buttons */}
                        <button 
                          onClick={() => {
                            triggerToast("Memproses... Rekap data terkirim!");
                          }}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg shadow-sm flex items-center justify-center gap-1 text-center cursor-pointer transition-colors"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Kirim Rekapitulasi Email</span>
                        </button>

                        {/* Recent Guestbook entries */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Aspirasi Tamu Terbaru</span>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                            {guestbook.slice(0, 2).map((msg, idx) => (
                              <div key={idx} className="bg-slate-50 border border-slate-100 p-2 rounded-xl text-[10px] space-y-1 leading-snug">
                                <div className="flex justify-between items-center font-bold text-slate-700">
                                  <span>{msg.senderName}</span>
                                  <span className="text-[7px] text-blue-600 bg-blue-50/70 px-1 rounded uppercase">{msg.role}</span>
                                </div>
                                <p className="text-slate-500 italic">"{msg.message}"</p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* HELP MODAL DIALOG MOCKUP */}
                <AnimatePresence>
                  {showSimModal && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center z-30 p-4">
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-2xl p-5 max-w-sm text-xs space-y-3.5"
                      >
                        <h4 className="font-extrabold text-sm text-indigo-700">Informasi &amp; Bantuan Portal</h4>
                        <div className="space-y-2 leading-relaxed text-slate-600 font-medium">
                          <p>Selamat! Spreadsheet ini terhubung dengan Portal Sekolah SD Negeri Cerdas Bangsa.</p>
                          <div className="p-2 bg-slate-50 rounded-lg space-y-1 border border-slate-100">
                            <span className="font-bold text-[10px] text-slate-700 uppercase">Aktivitas Skrip:</span>
                            <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                              <li><strong>Google Sheets Menu</strong>: Kirim rekapitulasi mading.</li>
                              <li><strong>Web App Server</strong>: Hosting web publik gratis.</li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex justify-end gap-1.5 pt-1">
                          <button 
                            onClick={() => setShowSimModal(false)}
                            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg cursor-pointer"
                          >
                            Tutup
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

              </div>
            )}

            {/* PUBLIC WEB APP DASHBOARD VIEW */}
            {spreadsheetView === 'webapp' && (
              <div className="bg-slate-50/50 flex-1 p-5 overflow-y-auto text-slate-700 space-y-5">
                
                {/* Header of Simulated Public Web app */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-md flex justify-between items-center">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[8px] uppercase">
                      PORTAL PUBLIK APPSCRIPT
                    </span>
                    <h5 className="font-black text-sm tracking-tight mt-1">SD Negeri Cerdas Bangsa</h5>
                    <p className="text-[10px] text-blue-100">Portal Informasi Umum berbasis Cloud Spreadsheet</p>
                  </div>
                  <span className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded">
                    NPSN: {stats.npsn}
                  </span>
                </div>

                {/* Switcher tabs */}
                <div className="flex bg-white border border-slate-100 p-1 rounded-xl shadow-sm text-[10px] font-bold">
                  {['stats', 'announcements', 'events', 'guestbook'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSimWebTab(tab as any)}
                      className={`flex-1 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                        simWebTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {tab === 'stats' ? 'Statistik' : tab === 'announcements' ? 'Pengumuman' : tab === 'events' ? 'Agenda' : 'Buku Tamu'}
                    </button>
                  ))}
                </div>

                {/* Dynamic simulated content blocks */}
                <div className="min-h-[160px]">
                  {simWebTab === 'stats' && (
                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm text-center">
                        <span className="text-[18px]">👥</span>
                        <h4 className="text-lg font-black text-slate-800 mt-1">{stats.totalStudents}</h4>
                        <span className="text-[8px] font-bold text-slate-400">Total Siswa</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm text-center">
                        <span className="text-[18px]">🎓</span>
                        <h4 className="text-lg font-black text-slate-800 mt-1">{stats.totalTeachers}</h4>
                        <span className="text-[8px] font-bold text-slate-400">Total Guru</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm text-center">
                        <span className="text-[18px]">🏫</span>
                        <h4 className="text-lg font-black text-slate-800 mt-1">{stats.totalClasses}</h4>
                        <span className="text-[8px] font-bold text-slate-400">Total Rombel</span>
                      </div>
                    </div>
                  )}

                  {simWebTab === 'announcements' && (
                    <div className="space-y-2">
                      {announcements.slice(0, 3).map((ann, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-1">
                          <div className="flex justify-between text-[8px] font-bold text-slate-400">
                            <span className="text-indigo-600">{ann.category.toUpperCase()}</span>
                            <span>{ann.date}</span>
                          </div>
                          <h6 className="font-extrabold text-slate-800 text-[11px]">{ann.title}</h6>
                          <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{ann.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {simWebTab === 'events' && (
                    <div className="space-y-2">
                      {events.slice(0, 3).map((ev, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex gap-3 items-center">
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex flex-col justify-center items-center text-indigo-700 font-extrabold text-center">
                            <span className="text-xs font-black">{ev.date.split('-')[2] || '01'}</span>
                            <span className="text-[7px]">BLN</span>
                          </div>
                          <div className="space-y-0.5 overflow-hidden">
                            <h6 className="font-bold text-slate-800 text-[11px] truncate">{ev.title}</h6>
                            <p className="text-[9px] text-slate-400 truncate">{ev.time} • {ev.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {simWebTab === 'guestbook' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {guestbook.slice(0, 4).map((msg, i) => (
                        <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-1">
                          <div className="flex justify-between items-center text-[9px] font-bold">
                            <span className="text-slate-700">{msg.senderName}</span>
                            <span className="text-[7px] text-indigo-600 bg-indigo-50 px-1 rounded">{msg.role}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 italic">"{msg.message}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Absolute Action Toast for simulations */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute bottom-4 left-4 right-4 bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-slate-700 shadow-lg text-xs font-semibold flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                  <span>{toastMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Right Column: Code Tabs & Copy Center (5/12) */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Code className="w-4.5 h-4.5 text-blue-500" /> Salin Kode Sumber Apps Script
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Salin kode di bawah ini, tempelkan di lembar Extensions &gt; Apps Script Anda.
            </p>
          </div>

          {/* Code Tabs wrapper */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden flex flex-col shadow-lg">
            
            {/* Header tabs trigger */}
            <div className="bg-slate-950 border-b border-slate-800 flex items-center justify-between p-2">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveCodeTab('gs')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all ${
                    activeCodeTab === 'gs' ? 'bg-slate-800 text-amber-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Code.gs (Backend)
                </button>
                <button
                  onClick={() => setActiveCodeTab('index')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all ${
                    activeCodeTab === 'index' ? 'bg-slate-800 text-amber-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Index.html (Web Dashboard)
                </button>
                <button
                  onClick={() => setActiveCodeTab('sidebar')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all ${
                    activeCodeTab === 'sidebar' ? 'bg-slate-800 text-amber-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sidebar.html (Widget)
                </button>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => {
                  const targetText = activeCodeTab === 'gs' ? codeGS : activeCodeTab === 'index' ? codeIndexHTML : codeSidebarHTML;
                  copyToClipboard(targetText, activeCodeTab);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Salin Kode"
              >
                {copiedTab === activeCodeTab ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Scrollable code text area */}
            <div className="p-4 overflow-y-auto max-h-[360px] text-[10px] font-mono leading-relaxed text-slate-300 bg-slate-950/80 custom-scrollbar">
              <pre className="whitespace-pre">
                {activeCodeTab === 'gs' && codeGS}
                {activeCodeTab === 'index' && codeIndexHTML}
                {activeCodeTab === 'sidebar' && codeSidebarHTML}
              </pre>
            </div>
          </div>
          
          {/* Active copy notification */}
          {copiedTab && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Kode {copiedTab === 'gs' ? 'Code.gs' : copiedTab === 'index' ? 'Index.html' : 'Sidebar.html'} berhasil disalin ke clipboard!</span>
            </div>
          )}

        </div>
      </div>

      {/* Deployment Tutorial Steps Section */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-500" />
          <h4 className="font-extrabold text-slate-800 text-base">
            Panduan Lengkap Pemasangan (Langkah-demi-Langkah)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
          
          {/* Step 1 */}
          <div className="space-y-2 border-l-2 border-indigo-100 pl-4 relative">
            <span className="absolute -left-2.5 top-0 w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm">
              1
            </span>
            <h5 className="font-extrabold text-slate-800 mt-0.5">Buka Editor Apps Script</h5>
            <p className="leading-relaxed text-slate-500">
              Pertama, pastikan Anda telah menyambungkan Google Sheets di bagian panel database atas. Buka spreadsheet Anda, lalu buka menu <strong>Ekstensi (Extensions) &gt; Apps Script</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2 border-l-2 border-indigo-100 pl-4 relative">
            <span className="absolute -left-2.5 top-0 w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm">
              2
            </span>
            <h5 className="font-extrabold text-slate-800 mt-0.5">Buat Berkas Baru</h5>
            <p className="leading-relaxed text-slate-500">
              Hapus kode bawaan di dalam berkas <code className="bg-slate-100 px-1 rounded font-bold">Code.gs</code>, lalu tempelkan kode <code className="bg-slate-100 px-1 rounded font-bold text-indigo-600">Code.gs</code> di atas. Selanjutnya, klik ikon tambah (+) &gt; pilih jenis <strong>HTML</strong> untuk membuat <code className="bg-slate-100 px-1 rounded font-bold text-emerald-600">Index.html</code> dan <code className="bg-slate-100 px-1 rounded font-bold text-amber-600">Sidebar.html</code>, lalu isi dengan masing-masing kode.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-2 border-l-2 border-indigo-100 pl-4 relative">
            <span className="absolute -left-2.5 top-0 w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm">
              3
            </span>
            <h5 className="font-extrabold text-slate-800 mt-0.5">Deploy Web App Publik</h5>
            <p className="leading-relaxed text-slate-500">
              Simpan proyek, klik tombol <strong>Deploy &gt; New Deployment</strong> di kanan atas. Pilih tipe <strong>Web app</strong>, konfigurasikan akses ke <strong>Anyone</strong> (agar bisa diakses publik), klik Deploy, dan setujui izin akses akun Google Anda. Link Web App siap dibagikan!
            </p>
          </div>

        </div>

        {/* Warning info card */}
        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-3 text-xs leading-relaxed text-blue-900/90 font-medium">
          <HelpCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-extrabold text-blue-950">Catatan Keamanan &amp; Skala Akses</span>
            <p>
              Seluruh kode Apps Script berjalan di atas lingkungan Google Cloud Anda secara langsung. Izin akses hanya diminta satu kali saat deploy pertama kali, guna membaca data sekolah yang diisikan ke Sheets Anda dan mengirimkan email laporan secara langsung ke admin.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

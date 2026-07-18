import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { SchoolStats, Announcement, SchoolEvent, GuestbookMessage } from '../types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider Setup
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let cachedAccessToken: string | null = typeof window !== 'undefined' ? localStorage.getItem('sdn_google_access_token') : null;
let isSigningIn = false;

// Initialize auth state listener.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      // Check if we have the token in localStorage/memory
      const currentToken = cachedAccessToken || (typeof window !== 'undefined' ? localStorage.getItem('sdn_google_access_token') : null);
      if (currentToken) {
        cachedAccessToken = currentToken;
        if (onAuthSuccess) onAuthSuccess(user, currentToken);
      } else if (!isSigningIn) {
        // We have a user session, but in-memory token is gone (e.g. refreshed page).
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan token akses dari Google.');
    }
    cachedAccessToken = credential.accessToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sdn_google_access_token', credential.accessToken);
    }
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Sign out
export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sdn_spreadsheet_id');
    localStorage.removeItem('sdn_google_access_token');
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * GOOGLE SHEETS API IMPLEMENTATION
 */

// Helper to make Google API requests
async function googleFetch(url: string, options: RequestInit = {}) {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Unauthenticated: Google Sheets access token is not available. Please sign in.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errText = await response.text();
    console.error(`Google API Error on ${url}:`, errText);
    throw new Error(`Google API Error: ${response.statusText} (${response.status})`);
  }
  return response.json();
}

// Create a new spreadsheet prefilled with default school data
export const createSchoolSpreadsheet = async (
  stats: SchoolStats,
  announcements: Announcement[],
  events: SchoolEvent[],
  guestbook: GuestbookMessage[]
): Promise<string> => {
  const title = "SD Negeri Cerdas Bangsa - Portal Database";
  
  // 1. Create spreadsheet with sheets
  const spreadsheetData = await googleFetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    body: JSON.stringify({
      properties: { title },
      sheets: [
        { properties: { title: 'Statistik' } },
        { properties: { title: 'Pengumuman' } },
        { properties: { title: 'Agenda' } },
        { properties: { title: 'Buku Tamu' } }
      ]
    })
  });

  const spreadsheetId = spreadsheetData.spreadsheetId;
  if (!spreadsheetId) {
    throw new Error("Gagal membuat spreadsheet baru.");
  }

  // Save to localStorage
  localStorage.setItem('sdn_spreadsheet_id', spreadsheetId);

  // 2. Prefill Statistik sheet
  const statsValues = [
    ['Kunci', 'Nilai', 'Keterangan'],
    ['totalStudents', stats.totalStudents, 'Total Siswa Aktif'],
    ['totalTeachers', stats.totalTeachers, 'Guru & Tenaga Pendidik'],
    ['totalClasses', stats.totalClasses, 'Rombongan Belajar (Rombel)'],
    ['accreditation', stats.accreditation, 'Akreditasi'],
    ['npsn', stats.npsn, 'NPSN']
  ];

  // Prefill Pengumuman sheet
  const annValues = [
    ['ID', 'Judul', 'Tanggal', 'Kategori', 'Konten', 'IsPinned'],
    ...announcements.map(ann => [
      ann.id,
      ann.title,
      ann.date,
      ann.category,
      ann.content,
      ann.isPinned ? 'TRUE' : 'FALSE'
    ])
  ];

  // Prefill Agenda sheet
  const eventValues = [
    ['ID', 'Judul', 'Tanggal', 'Waktu', 'Lokasi', 'Deskripsi'],
    ...events.map(ev => [
      ev.id,
      ev.title,
      ev.date,
      ev.time,
      ev.location,
      ev.description
    ])
  ];

  // Prefill Buku Tamu sheet
  const guestbookValues = [
    ['ID', 'Nama Pengirim', 'Status/Hubungan', 'Email', 'Pesan', 'Tanggal'],
    ...guestbook.map(msg => [
      msg.id,
      msg.senderName,
      msg.role,
      msg.email,
      msg.message,
      msg.date
    ])
  ];

  // Write all values in a batch update
  await googleFetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: [
        { range: 'Statistik!A1:C6', values: statsValues },
        { range: `Pengumuman!A1:F${annValues.length}`, values: annValues },
        { range: `Agenda!A1:F${eventValues.length}`, values: eventValues },
        { range: `Buku Tamu!A1:F${guestbookValues.length}`, values: guestbookValues }
      ]
    })
  });

  return spreadsheetId;
};

// Fetch all data from connected Google Sheet
export interface ConnectedSchoolData {
  stats: SchoolStats;
  announcements: Announcement[];
  events: SchoolEvent[];
  guestbook: GuestbookMessage[];
}

export const fetchSchoolSpreadsheetData = async (spreadsheetId: string): Promise<ConnectedSchoolData> => {
  // Query Statistik, Pengumuman, Agenda, Buku Tamu in one batchGet call
  const ranges = ['Statistik!A2:B6', 'Pengumuman!A2:F100', 'Agenda!A2:F100', 'Buku Tamu!A2:F100'];
  const queryStr = ranges.map(r => `ranges=${encodeURIComponent(r)}`).join('&');
  
  const result = await googleFetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${queryStr}`);
  
  const valueRanges = result.valueRanges || [];

  // Parse Stats
  const statsRows = valueRanges[0]?.values || [];
  const stats: Partial<SchoolStats> = {};
  statsRows.forEach((row: string[]) => {
    const key = row[0];
    const val = row[1];
    if (key === 'totalStudents') stats.totalStudents = parseInt(val) || 0;
    else if (key === 'totalTeachers') stats.totalTeachers = parseInt(val) || 0;
    else if (key === 'totalClasses') stats.totalClasses = parseInt(val) || 0;
    else if (key === 'accreditation') stats.accreditation = val;
    else if (key === 'npsn') stats.npsn = val;
  });

  // Parse Announcements
  const annRows = valueRanges[1]?.values || [];
  const announcements: Announcement[] = annRows.map((row: string[], index: number) => ({
    id: row[0] || `ann-sheet-${index}`,
    title: row[1] || 'Pengumuman',
    date: row[2] || new Date().toISOString().split('T')[0],
    category: (row[3] as any) || 'Pengumuman',
    content: row[4] || '',
    isPinned: row[5] === 'TRUE'
  }));

  // Parse Events
  const eventRows = valueRanges[2]?.values || [];
  const events: SchoolEvent[] = eventRows.map((row: string[], index: number) => ({
    id: row[0] || `ev-sheet-${index}`,
    title: row[1] || 'Kegiatan',
    date: row[2] || new Date().toISOString().split('T')[0],
    time: row[3] || '08:00 WIB',
    location: row[4] || 'SD Negeri Cerdas Bangsa',
    description: row[5] || ''
  }));

  // Parse Guestbook
  const guestbookRows = valueRanges[3]?.values || [];
  const guestbook: GuestbookMessage[] = guestbookRows.map((row: string[], index: number) => ({
    id: row[0] || `gb-sheet-${index}`,
    senderName: row[1] || 'Tamu',
    role: (row[2] as any) || 'Masyarakat',
    email: row[3] || '',
    message: row[4] || '',
    date: row[5] || new Date().toISOString()
  }));

  return {
    stats: {
      totalStudents: stats.totalStudents || 342,
      totalTeachers: stats.totalTeachers || 18,
      totalClasses: stats.totalClasses || 12,
      accreditation: stats.accreditation || 'A',
      npsn: stats.npsn || '20103245'
    },
    announcements,
    events,
    guestbook: guestbook.reverse() // Keep newest guestbook messages at top
  };
};

// Append a guestbook message to Google Sheet
export const appendGuestbookEntry = async (spreadsheetId: string, msg: GuestbookMessage) => {
  const range = 'Buku Tamu!A:F';
  const values = [
    [msg.id, msg.senderName, msg.role, msg.email, msg.message, msg.date]
  ];

  await googleFetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    body: JSON.stringify({ values })
  });
};

// Update School Statistics in Google Sheet
export const updateStatsInSheet = async (spreadsheetId: string, stats: SchoolStats) => {
  const range = 'Statistik!A2:B6';
  const values = [
    ['totalStudents', stats.totalStudents],
    ['totalTeachers', stats.totalTeachers],
    ['totalClasses', stats.totalClasses],
    ['accreditation', stats.accreditation],
    ['npsn', stats.npsn]
  ];

  await googleFetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    body: JSON.stringify({ values })
  });
};

// Append a new Announcement to Google Sheet
export const appendAnnouncementToSheet = async (spreadsheetId: string, ann: Announcement) => {
  const range = 'Pengumuman!A:F';
  const values = [
    [ann.id, ann.title, ann.date, ann.category, ann.content, ann.isPinned ? 'TRUE' : 'FALSE']
  ];

  await googleFetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    body: JSON.stringify({ values })
  });
};

// Append a new Event to Google Sheet
export const appendEventToSheet = async (spreadsheetId: string, ev: SchoolEvent) => {
  const range = 'Agenda!A:F';
  const values = [
    [ev.id, ev.title, ev.date, ev.time, ev.location, ev.description]
  ];

  await googleFetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`, {
    method: 'POST',
    body: JSON.stringify({ values })
  });
};

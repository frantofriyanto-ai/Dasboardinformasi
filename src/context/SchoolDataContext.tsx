import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { SchoolStats, Announcement, SchoolEvent, GuestbookMessage } from '../types';
import { 
  schoolStats as staticStats, 
  announcementsData as staticAnnouncements, 
  eventsData as staticEvents, 
  initialGuestbook as staticGuestbook 
} from '../data/schoolData';
import { 
  initAuth, 
  googleSignIn, 
  logout as googleLogout, 
  createSchoolSpreadsheet, 
  fetchSchoolSpreadsheetData, 
  appendGuestbookEntry,
  updateStatsInSheet,
  appendAnnouncementToSheet,
  appendEventToSheet
} from '../lib/googleSheets';

interface SchoolDataContextProps {
  user: User | null;
  token: string | null;
  spreadsheetId: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  stats: SchoolStats;
  announcements: Announcement[];
  events: SchoolEvent[];
  guestbook: GuestbookMessage[];
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  createNewSpreadsheet: () => Promise<string>;
  connectSpreadsheet: (id: string) => Promise<void>;
  syncData: () => Promise<void>;
  addGuestbookMessage: (msg: Omit<GuestbookMessage, 'id' | 'date'>) => Promise<void>;
  addAnnouncement: (ann: Omit<Announcement, 'id'>) => Promise<void>;
  addEvent: (ev: Omit<SchoolEvent, 'id'>) => Promise<void>;
  updateStats: (newStats: SchoolStats) => Promise<void>;
  error: string | null;
  clearError: () => void;
  isAdmin: boolean;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
}

const SchoolDataContext = createContext<SchoolDataContextProps | undefined>(undefined);

export const useSchoolData = () => {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error('useSchoolData must be used within a SchoolDataProvider');
  }
  return context;
};

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  
  // Admin Mode states
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('sdn_is_admin') === 'true' : false;
  });

  const loginAdmin = async (password: string): Promise<boolean> => {
    // Passcode for admin authentication
    if (password === 'admin123' || password === 'cerdas123') {
      setIsAdmin(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sdn_is_admin', 'true');
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sdn_is_admin');
    }
  };

  // App states
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic school data states
  const [stats, setStats] = useState<SchoolStats>(staticStats);
  const [announcements, setAnnouncements] = useState<Announcement[]>(staticAnnouncements);
  const [events, setEvents] = useState<SchoolEvent[]>(staticEvents);
  const [guestbook, setGuestbook] = useState<GuestbookMessage[]>([]);

  // Load guestbook from localStorage initially
  useEffect(() => {
    const savedGb = localStorage.getItem('sdn_guestbook');
    if (savedGb) {
      try {
        setGuestbook(JSON.parse(savedGb));
      } catch (e) {
        setGuestbook(staticGuestbook);
      }
    } else {
      setGuestbook(staticGuestbook);
    }
  }, []);

  // Initialize Auth State and check for existing spreadsheet ID
  useEffect(() => {
    const savedSheetId = localStorage.getItem('sdn_spreadsheet_id');
    if (savedSheetId) {
      setSpreadsheetId(savedSheetId);
    }

    const unsubscribe = initAuth(
      async (firebaseUser, accessToken) => {
        setUser(firebaseUser);
        setToken(accessToken);
        
        // If we have a saved spreadsheet ID, load the data
        if (savedSheetId) {
          try {
            setIsSyncing(true);
            const data = await fetchSchoolSpreadsheetData(savedSheetId);
            setStats(data.stats);
            setAnnouncements(data.announcements);
            setEvents(data.events);
            setGuestbook(data.guestbook);
          } catch (err: any) {
            console.error("Gagal sinkronisasi data dari Google Sheets:", err);
            setError("Gagal memuat data dari Google Sheets. Pastikan Anda memiliki akses ke spreadsheet tersebut.");
          } finally {
            setIsSyncing(false);
          }
        }
        setIsLoading(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sign In
  const signIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        
        // Check if there is a saved spreadsheet ID and load it
        const savedSheetId = localStorage.getItem('sdn_spreadsheet_id');
        if (savedSheetId) {
          try {
            setIsSyncing(true);
            const data = await fetchSchoolSpreadsheetData(savedSheetId);
            setStats(data.stats);
            setAnnouncements(data.announcements);
            setEvents(data.events);
            setGuestbook(data.guestbook);
          } catch (e) {
            console.error("Failed to load existing sheet on signin:", e);
          } finally {
            setIsSyncing(false);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setError("Gagal melakukan login Google.");
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Out
  const signOut = async () => {
    setError(null);
    try {
      await googleLogout();
      setUser(null);
      setToken(null);
      setSpreadsheetId(null);
      
      // Fallback to static data
      setStats(staticStats);
      setAnnouncements(staticAnnouncements);
      setEvents(staticEvents);
      
      const savedGb = localStorage.getItem('sdn_guestbook');
      if (savedGb) {
        setGuestbook(JSON.parse(savedGb));
      } else {
        setGuestbook(staticGuestbook);
      }
    } catch (err: any) {
      console.error(err);
      setError("Gagal melakukan logout.");
    }
  };

  // Create new Spreadsheet
  const createNewSpreadsheet = async (): Promise<string> => {
    if (!user || !token) {
      throw new Error("Anda harus login Google terlebih dahulu.");
    }
    setError(null);
    setIsSyncing(true);
    try {
      // Get current local guestbook to populate with
      const currentGb = guestbook.length > 0 ? guestbook : staticGuestbook;
      
      const newId = await createSchoolSpreadsheet(stats, announcements, events, currentGb);
      setSpreadsheetId(newId);
      
      // Sync fresh data
      const data = await fetchSchoolSpreadsheetData(newId);
      setStats(data.stats);
      setAnnouncements(data.announcements);
      setEvents(data.events);
      setGuestbook(data.guestbook);
      
      return newId;
    } catch (err: any) {
      console.error(err);
      setError("Gagal membuat Google Sheets baru.");
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  // Connect existing Spreadsheet ID
  const connectSpreadsheet = async (id: string) => {
    if (!user || !token) {
      throw new Error("Anda harus login Google terlebih dahulu.");
    }
    setError(null);
    setIsSyncing(true);
    try {
      const data = await fetchSchoolSpreadsheetData(id);
      localStorage.setItem('sdn_spreadsheet_id', id);
      setSpreadsheetId(id);
      setStats(data.stats);
      setAnnouncements(data.announcements);
      setEvents(data.events);
      setGuestbook(data.guestbook);
    } catch (err: any) {
      console.error(err);
      setError("ID Google Sheets tidak valid atau Anda tidak memiliki izin akses.");
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  // Force sync data
  const syncData = async () => {
    if (!spreadsheetId) return;
    setError(null);
    setIsSyncing(true);
    try {
      const data = await fetchSchoolSpreadsheetData(spreadsheetId);
      setStats(data.stats);
      setAnnouncements(data.announcements);
      setEvents(data.events);
      setGuestbook(data.guestbook);
    } catch (err: any) {
      console.error(err);
      setError("Gagal melakukan sinkronisasi data.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Add Guestbook Message (saves to sheet if connected, otherwise local storage)
  const addGuestbookMessage = async (msg: Omit<GuestbookMessage, 'id' | 'date'>) => {
    setError(null);
    
    const newMsg: GuestbookMessage = {
      ...msg,
      id: `gb-${Date.now()}`,
      date: new Date().toISOString(),
    };

    // Always update local state first for immediate UI update
    const updatedGb = [newMsg, ...guestbook];
    setGuestbook(updatedGb);
    localStorage.setItem('sdn_guestbook', JSON.stringify(updatedGb));

    if (spreadsheetId && token) {
      try {
        await appendGuestbookEntry(spreadsheetId, newMsg);
      } catch (err: any) {
        console.error("Gagal menyimpan ke Google Sheets:", err);
        setError("Koneksi Google Sheets gagal. Aspirasi tersimpan di browser lokal Anda.");
      }
    }
  };

  // Add Announcement
  const addAnnouncement = async (ann: Omit<Announcement, 'id'>) => {
    setError(null);
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
    };

    // Update local state
    setAnnouncements(prev => [newAnn, ...prev]);

    if (spreadsheetId && token) {
      try {
        await appendAnnouncementToSheet(spreadsheetId, newAnn);
      } catch (err: any) {
        console.error("Gagal menambahkan pengumuman ke Google Sheets:", err);
        setError("Gagal menyinkronkan pengumuman baru ke Google Sheets.");
      }
    }
  };

  // Add Event
  const addEvent = async (ev: Omit<SchoolEvent, 'id'>) => {
    setError(null);
    const newEv: SchoolEvent = {
      ...ev,
      id: `ev-${Date.now()}`,
    };

    // Update local state
    setEvents(prev => [newEv, ...prev]);

    if (spreadsheetId && token) {
      try {
        await appendEventToSheet(spreadsheetId, newEv);
      } catch (err: any) {
        console.error("Gagal menambahkan agenda ke Google Sheets:", err);
        setError("Gagal menyinkronkan agenda baru ke Google Sheets.");
      }
    }
  };

  // Update Stats
  const updateStats = async (newStats: SchoolStats) => {
    setError(null);
    setStats(newStats);

    if (spreadsheetId && token) {
      try {
        await updateStatsInSheet(spreadsheetId, newStats);
      } catch (err: any) {
        console.error("Gagal mengupdate statistik ke Google Sheets:", err);
        setError("Gagal menyinkronkan data statistik ke Google Sheets.");
      }
    }
  };

  const clearError = () => setError(null);

  return (
    <SchoolDataContext.Provider value={{
      user,
      token,
      spreadsheetId,
      isLoading,
      isSyncing,
      stats,
      announcements,
      events,
      guestbook,
      signIn,
      signOut,
      createNewSpreadsheet,
      connectSpreadsheet,
      syncData,
      addGuestbookMessage,
      addAnnouncement,
      addEvent,
      updateStats,
      error,
      clearError,
      isAdmin,
      loginAdmin,
      logoutAdmin
    }}>
      {children}
    </SchoolDataContext.Provider>
  );
};

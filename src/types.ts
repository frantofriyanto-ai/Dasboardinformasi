export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  accreditation: string;
  npsn: string;
}

export interface ClassData {
  id: string;
  className: string;
  maleCount: number;
  femaleCount: number;
  homeroomTeacher: string;
  students: string[];
}

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  role: string;
  photoUrl?: string;
  email: string;
  subjects: string[];
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: 'Akademik' | 'Kegiatan' | 'Pengumuman' | 'Urgent';
  content: string;
  isPinned?: boolean;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface Extracurricular {
  id: string;
  name: string;
  mentor: string;
  schedule: string;
  description: string;
  iconName: string;
}

export interface GuestbookMessage {
  id: string;
  senderName: string;
  role: 'Orang Tua' | 'Alumni' | 'Siswa' | 'Masyarakat';
  email: string;
  message: string;
  date: string;
}

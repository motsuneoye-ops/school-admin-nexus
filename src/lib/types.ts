export interface School {
  id: string;
  name: string;
  logo: string;
  location: string;
  studentCount: number;
  teacherCount: number;
  address?: string;
  email?: string;
  phone?: string;
  principal?: string;
  foundedYear?: string;
}

export interface Student {
  id: string;
  schoolId: string;
  name: string;
  grade: string;
  photo: string;
  email: string;
  averageGrade: number;
  performanceTrend: { month: string; score: number }[];
  subjectGrades: { subject: string; grade: number }[];
}

export interface Teacher {
  id: string;
  name: string;
  photo: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  grade: string;
}

export interface PerformanceStats {
  subject: string;
  average: number;
  threshold: number;
}
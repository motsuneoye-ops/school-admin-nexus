export interface School {
  id: string;
  name: string;
  logo: string;
  location: string;
  studentCount: number;
  teacherCount: number;
  code: string; // Required for search
  address?: string;
  email?: string;
  phone?: string;
  principal?: string;
  foundedYear?: string;
}

export interface DetailedScore {
  subjectId: string;
  test1: number;      // Max 30
  groupWork: number;  // Max 20
  test2: number;      // Max 30
  projectWork: number;// Max 20
  examScore: number;  // Max 100
  // Computed fields (usually calculated on the fly or stored for performance)
  totalClassScore?: number; // Sum of tests/works (max 100)
  classScore50?: number;    // 50% of totalClassScore
  examScore50?: number;     // 50% of examScore
  overallTotal?: number;    // classScore50 + examScore50
  position?: number;
  grade?: string;
  remark?: string;
}

export interface Student {
  id: string;
  schoolId: string;
  name: string;
  grade: string; // Class name like "10th Grade"
  photo: string;
  email: string;
  averageGrade: number;
  performanceTrend: { month: string; score: number }[];
  subjectGrades: { subject: string; grade: number }[]; // Standard format
  detailedScores?: DetailedScore[]; // New detailed format
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
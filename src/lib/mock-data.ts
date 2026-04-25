import { School, Student, Teacher, Subject } from './types';

export const SCHOOLS: School[] = [
  {
    id: '1',
    name: 'Horizon International School',
    logo: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c857d205-9d8a-4c29-8c16-f6c5240ec6c1/school-logo-1-3804afa6-1777146061461.webp',
    location: 'New York, NY',
    studentCount: 1250,
    teacherCount: 85,
    address: '123 Education Way, New York, NY 10001',
    email: 'admin@horizon.edu',
    phone: '+1 (212) 555-0123',
    principal: 'Dr. Elizabeth Blackwell',
    foundedYear: '1995',
  },
  {
    id: '2',
    name: 'Tech Institute of Excellence',
    logo: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c857d205-9d8a-4c29-8c16-f6c5240ec6c1/school-logo-2-b03db47b-1777146061054.webp',
    location: 'San Francisco, CA',
    studentCount: 850,
    teacherCount: 62,
  },
  {
    id: '3',
    name: 'Greenwood Elementary',
    logo: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c857d205-9d8a-4c29-8c16-f6c5240ec6c1/school-logo-3-cf61e62d-1777146061966.webp',
    location: 'Seattle, WA',
    studentCount: 450,
    teacherCount: 30,
  },
];

const MOCK_TREND = [
  { month: 'Sep', score: 75 },
  { month: 'Oct', score: 78 },
  { month: 'Nov', score: 72 },
  { month: 'Dec', score: 85 },
  { month: 'Jan', score: 82 },
];

export const STUDENTS: Student[] = [
  {
    id: 's1',
    schoolId: '1',
    name: 'Alex Johnson',
    grade: '10th Grade',
    photo: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c857d205-9d8a-4c29-8c16-f6c5240ec6c1/student-avatar-1-36a483f9-1777146065601.webp',
    email: 'alex.j@example.com',
    averageGrade: 88,
    performanceTrend: MOCK_TREND,
    subjectGrades: [
      { subject: 'Math', grade: 92 },
      { subject: 'Science', grade: 85 },
      { subject: 'History', grade: 88 },
      { subject: 'English', grade: 87 },
    ],
  },
  {
    id: 's2',
    schoolId: '1',
    name: 'Sarah Williams',
    grade: '10th Grade',
    photo: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c857d205-9d8a-4c29-8c16-f6c5240ec6c1/student-avatar-3-5de5adbb-1777146065804.webp',
    email: 'sarah.w@example.com',
    averageGrade: 62,
    performanceTrend: [
      { month: 'Sep', score: 65 },
      { month: 'Oct', score: 60 },
      { month: 'Nov', score: 58 },
      { month: 'Dec', score: 65 },
      { month: 'Jan', score: 62 },
    ],
    subjectGrades: [
      { subject: 'Math', grade: 55 },
      { subject: 'Science', grade: 62 },
      { subject: 'History', grade: 68 },
      { subject: 'English', grade: 63 },
    ],
  },
  {
    id: 's3',
    schoolId: '2',
    name: 'Michael Chen',
    grade: '11th Grade',
    photo: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c857d205-9d8a-4c29-8c16-f6c5240ec6c1/student-avatar-2-85992b68-1777146065567.webp',
    email: 'm.chen@example.com',
    averageGrade: 95,
    performanceTrend: MOCK_TREND.map(t => ({ ...t, score: t.score + 10 })),
    subjectGrades: [
      { subject: 'Math', grade: 98 },
      { subject: 'Science', grade: 96 },
      { subject: 'History', grade: 92 },
      { subject: 'English', grade: 94 },
    ],
  },
];

export const TEACHERS: Teacher[] = [
  {
    id: 't1',
    name: 'John Smith',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    email: 'j.smith@horizon.edu',
    phone: '+1 (555) 123-4567',
    subjects: ['Math', 'Physics'],
    classes: ['10th Grade A', '10th Grade B'],
  },
  {
    id: 't2',
    name: 'Emily Davis',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    email: 'e.davis@horizon.edu',
    phone: '+1 (555) 234-5678',
    subjects: ['English', 'History'],
    classes: ['11th Grade A'],
  },
];

export const SUBJECTS: Subject[] = [
  { id: 'sub1', name: 'Mathematics', code: 'MATH101', grade: '10th Grade' },
  { id: 'sub2', name: 'Science', code: 'SCI101', grade: '10th Grade' },
  { id: 'sub3', name: 'English Literature', code: 'ENG101', grade: '10th Grade' },
  { id: 'sub4', name: 'History', code: 'HIST101', grade: '10th Grade' },
];
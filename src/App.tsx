import { useState, useMemo } from 'react';
import { SCHOOLS, STUDENTS } from './lib/mock-data';
import { School, Student } from './lib/types';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { SchoolAdminDashboard } from './components/SchoolAdminDashboard';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from 'lucide-react';

function App() {
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [students, setStudents] = useState<Student[]>(STUDENTS);

  const filteredStudents = useMemo(() => {
    if (!selectedSchool) return [];
    return students.filter(s => s.schoolId === selectedSchool.id);
  }, [selectedSchool, students]);

  const handleUpdateStudents = (newStudents: Student[]) => {
    // In a real app, we'd update just the changed students.
    // Here we'll update the global students state by replacing existing ones with new ones for this school
    const otherStudents = students.filter(s => s.schoolId !== selectedSchool?.id);
    setStudents([...otherStudents, ...newStudents]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl cursor-pointer" onClick={() => setSelectedSchool(null)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Layout className="h-5 w-5" />
            </div>
            <span>EduDash <span className="text-primary">Pro</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button 
              className={`text-sm font-medium transition-colors hover:text-primary ${!selectedSchool ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setSelectedSchool(null)}
            >
              Network Overview
            </button>
            <span className="text-muted-foreground/30">/</span>
            <span className="text-sm font-medium text-muted-foreground">Support</span>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!selectedSchool ? (
          <SuperAdminDashboard 
            schools={SCHOOLS} 
            onSelectSchool={setSelectedSchool} 
          />
        ) : (
          <SchoolAdminDashboard 
            school={selectedSchool}
            students={filteredStudents}
            onBack={() => setSelectedSchool(null)}
            onUpdateStudents={handleUpdateStudents}
          />
        )}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
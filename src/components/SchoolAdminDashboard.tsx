import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Settings, 
  BookOpen, 
  FileText, 
  ChevronLeft,
  LayoutDashboard,
  Printer,
  Eraser,
  ListTodo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { School, Student } from '@/lib/types';
import { AnalyticsCharts } from './AnalyticsCharts';
import { ManageStudents } from './ManageStudents';
import { ManageTeachers } from './ManageTeachers';
import { SchoolSettings } from './SchoolSettings';
import { ManageClasses } from './ManageClasses';
import { ReportGenerator } from './ReportGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface SchoolAdminDashboardProps {
  school: School;
  students: Student[];
  onBack: () => void;
  onUpdateStudents: (students: Student[]) => void;
}

type DashboardTab = 'dashboard' | 'students' | 'classes' | 'teachers' | 'subjects' | 'bulk-pdf' | 'clear-data' | 'settings';

export const SchoolAdminDashboard: React.FC<SchoolAdminDashboardProps> = ({ 
  school, 
  students, 
  onBack,
  onUpdateStudents
}) => {
  const [activeTab, setActiveTab] = React.useState<DashboardTab>('dashboard');

  const menuItems = [
    { label: 'Manage Students', icon: Users, color: 'text-blue-500', tab: 'students' },
    { label: 'Manage Classes', icon: ListTodo, color: 'text-indigo-500', tab: 'classes' },
    { label: 'Manage Teachers', icon: GraduationCap, color: 'text-purple-500', tab: 'teachers' },
    { label: 'Manage Subjects', icon: BookOpen, color: 'text-emerald-500', tab: 'subjects' },
    { label: 'Bulk PDF', icon: Printer, color: 'text-orange-500', tab: 'bulk-pdf' },
    { label: 'Clear Data', icon: Eraser, color: 'text-rose-500', tab: 'clear-data' },
    { label: 'Settings', icon: Settings, color: 'text-slate-500', tab: 'settings' },
  ];

  const handleUpdateStudent = (updatedStudent: Student) => {
    const newStudents = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    onUpdateStudents(newStudents);
  };

  const handleDeleteStudent = (id: string) => {
    const newStudents = students.filter(s => s.id !== id);
    onUpdateStudents(newStudents);
  };

  const handleClearData = () => {
    if (confirm('Are you absolutely sure you want to clear all student performance data? This cannot be undone.')) {
      const clearedStudents = students.map(s => ({
        ...s,
        detailedScores: [],
        subjectGrades: [],
        averageGrade: 0
      }));
      onUpdateStudents(clearedStudents);
      toast.success('All academic records cleared successfully.');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">{school.studentCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Average Grade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">82%</div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-widest">School Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-primary">{school.code}</div>
                </CardContent>
              </Card>
            </div>

            <AnalyticsCharts students={students} />
          </div>
        );
      case 'students':
        return (
          <ManageStudents 
            students={students} 
            onUpdate={handleUpdateStudent}
            onDelete={handleDeleteStudent}
          />
        );
      case 'classes':
      case 'subjects':
        return (
          <ManageClasses 
            students={students}
            onUpdateStudents={onUpdateStudents}
          />
        );
      case 'teachers':
        return <ManageTeachers />;
      case 'settings':
        return <SchoolSettings school={school} />;
      case 'bulk-pdf':
        return <ReportGenerator students={students} />;
      case 'clear-data':
        return (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone: Clear Academic Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">This action will reset all scores, positions, and grades for all students in this school.</p>
              <Button variant="destructive" size="lg" onClick={handleClearData} className="font-bold">
                Reset All Academic Data
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full border hover:bg-muted">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white p-2 shadow-sm border flex items-center justify-center overflow-hidden">
              <img src={school.logo} alt={school.name} className="h-full w-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{school.name}</h1>
              <p className="text-sm font-bold text-primary">Portal Administrator</p>
            </div>
          </div>
        </div>
        
        <Button 
          variant={activeTab === 'dashboard' ? 'default' : 'outline'}
          className="font-bold gap-2 shadow-sm"
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard className="h-4 w-4" />
          Main Dashboard
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {menuItems.map((item, idx) => (
          <Button
            key={idx}
            variant={activeTab === item.tab ? 'default' : 'outline'}
            className={`flex-1 min-w-[120px] h-20 flex-col gap-1 transition-all ${
              activeTab === item.tab ? 'shadow-md scale-105' : 'hover:bg-muted'
            }`}
            onClick={() => setActiveTab(item.tab as DashboardTab)}
          >
            <item.icon className={`h-5 w-5 ${activeTab === item.tab ? 'text-primary-foreground' : item.color}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </Button>
        ))}
      </div>

      <div className="pt-4 bg-white/50 dark:bg-slate-900/50 rounded-3xl p-6 border shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
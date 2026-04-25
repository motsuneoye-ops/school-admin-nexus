import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Settings, 
  BookOpen, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  ChevronLeft,
  ArrowRightLeft,
  Download
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
import { ClassReport } from './ClassReport';
import { DataMigration } from './DataMigration';
import { motion, AnimatePresence } from 'framer-motion';

interface SchoolAdminDashboardProps {
  school: School;
  students: Student[];
  onBack: () => void;
  onUpdateStudents: (students: Student[]) => void;
}

type DashboardTab = 'overview' | 'students' | 'teachers' | 'settings' | 'classes' | 'reports' | 'class-reports' | 'migration';

export const SchoolAdminDashboard: React.FC<SchoolAdminDashboardProps> = ({ 
  school, 
  students, 
  onBack,
  onUpdateStudents
}) => {
  const [activeTab, setActiveTab] = React.useState<DashboardTab>('overview');

  const studentsNeedingSupport = students.filter(s => s.averageGrade < 70);

  const menuItems = [
    { label: 'Manage Students', icon: TrendingUp, color: 'text-pink-500', tab: 'students' },
    { label: 'Manage Teachers', icon: Users, color: 'text-purple-500', tab: 'teachers' },
    { label: 'Subjects', icon: BookOpen, color: 'text-emerald-500', tab: 'classes' },
    { label: 'Generate Report', icon: FileText, color: 'text-orange-500', tab: 'reports' },
    { label: 'Add Class Report', icon: Download, color: 'text-blue-500', tab: 'class-reports' },
    { label: 'Add Data Migration', icon: ArrowRightLeft, color: 'text-indigo-500', tab: 'migration' },
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

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{school.studentCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Average Grade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">82%</div>
                </CardContent>
              </Card>
              <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400 uppercase">Attention Needed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-red-700 dark:text-red-400">
                      {studentsNeedingSupport.length}
                    </div>
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <AnalyticsCharts students={students} />

            <Card>
              <CardHeader>
                <CardTitle>Students Requiring Support (Grade &lt; 70%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentsNeedingSupport.map(student => (
                    <div key={student.id} className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
                      <div className="flex items-center gap-3">
                        <img src={student.photo} alt={student.name} className="h-10 w-10 rounded-full" />
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.grade}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">{student.averageGrade}%</p>
                        <p className="text-xs text-muted-foreground">Average Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
      case 'teachers':
        return <ManageTeachers />;
      case 'settings':
        return <SchoolSettings school={school} />;
      case 'classes':
        return (
          <ManageClasses 
            students={students}
            onUpdateStudents={onUpdateStudents}
          />
        );
      case 'reports':
        return <ReportGenerator students={students} />;
      case 'class-reports':
        return <ClassReport />;
      case 'migration':
        return <DataMigration />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-4">
            <img src={school.logo} alt={school.name} className="h-12 w-12 rounded-lg object-contain" />
            <div>
              <h1 className="text-2xl font-bold">{school.name}</h1>
              <p className="text-sm text-muted-foreground">{school.location} \\u2022 School Admin Panel</p>
            </div>
          </div>
        </div>
        
        <Button 
          variant={activeTab === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveTab('overview')}
        >
          Dashboard Overview
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        {menuItems.map((item, idx) => (
          <Button
            key={idx}
            variant={activeTab === item.tab ? 'default' : 'outline'}
            className={`flex h-auto flex-col gap-2 p-4 transition-all hover:border-primary ${
              activeTab === item.tab ? 'ring-2 ring-primary ring-offset-2' : 'hover:bg-primary/5'
            }`}
            onClick={() => setActiveTab(item.tab as DashboardTab)}
          >
            <item.icon className={`h-6 w-6 ${activeTab === item.tab ? 'text-primary-foreground' : item.color}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </Button>
        ))}
      </div>

      <div className="pt-4">
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
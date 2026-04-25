import { useState, useMemo } from 'react';
import { SCHOOLS, STUDENTS } from './lib/mock-data';
import { School, Student } from './lib/types';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { SchoolAdminDashboard } from './components/SchoolAdminDashboard';
import { Toaster } from '@/components/ui/sonner';
import { Layout, Search, School as SchoolIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [schools, setSchools] = useState<School[]>(SCHOOLS);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [students, setStudents] = useState<Student[]>(STUDENTS);
  const [schoolCode, setSchoolCode] = useState('');
  const [foundSchool, setFoundSchool] = useState<School | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const filteredStudents = useMemo(() => {
    if (!selectedSchool) return [];
    return students.filter(s => s.schoolId === selectedSchool.id);
  }, [selectedSchool, students]);

  const handleUpdateStudents = (newStudents: Student[]) => {
    const otherStudents = students.filter(s => s.schoolId !== selectedSchool?.id);
    setStudents([...otherStudents, ...newStudents]);
  };

  const handleSearch = () => {
    const found = schools.find(s => s.code.toLowerCase() === schoolCode.toLowerCase());
    setFoundSchool(found || null);
    if (!found) {
      // Could add a toast here
    }
  };

  const handleCreateSchool = (newSchool: School) => {
    setSchools(prev => [...prev, newSchool]);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-foreground selection:bg-primary/10">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl cursor-pointer" onClick={() => {
            setSelectedSchool(null);
            setFoundSchool(null);
            setSchoolCode('');
            setIsAdminMode(false);
          }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Layout className="h-5 w-5" />
            </div>
            <span>EduDash <span className="text-primary">Pro</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            {!selectedSchool && (
              <Button 
                variant={isAdminMode ? "default" : "ghost"} 
                size="sm" 
                className="hidden md:flex gap-2"
                onClick={() => setIsAdminMode(!isAdminMode)}
              >
                <ShieldCheck className="h-4 w-4" />
                {isAdminMode ? "Admin Panel Active" : "Super Admin Login"}
              </Button>
            )}
            <nav className="hidden md:flex items-center gap-6">
              <button 
                className={`text-sm font-medium transition-colors hover:text-primary ${!selectedSchool ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => {
                  setSelectedSchool(null);
                  setFoundSchool(null);
                  setIsAdminMode(false);
                }}
              >
                Network Overview
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {selectedSchool ? (
            <motion.div
              key="school-admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SchoolAdminDashboard 
                school={selectedSchool}
                students={filteredStudents}
                onBack={() => setSelectedSchool(null)}
                onUpdateStudents={handleUpdateStudents}
              />
            </motion.div>
          ) : isAdminMode ? (
            <motion.div
              key="super-admin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <SuperAdminDashboard 
                schools={schools} 
                onSelectSchool={setSelectedSchool}
                onCreateSchool={handleCreateSchool}
              />
            </motion.div>
          ) : (
            <motion.div
              key="search-flow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-12 py-12"
            >
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                  Welcome to <span className="text-primary">EduDash Pro</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Enter your school code to access your administrative portal.
                </p>
              </div>

              <Card className="border-2 shadow-2xl overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input 
                        placeholder="Enter School Code (e.g. HORIZON-01)" 
                        className="h-14 pl-12 text-lg font-medium border-2 focus-visible:ring-primary"
                        value={schoolCode}
                        onChange={(e) => setSchoolCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                    <Button className="h-14 px-10 text-lg font-bold shadow-lg" onClick={handleSearch}>
                      Search Portal
                    </Button>
                  </div>

                  <AnimatePresence>
                    {foundSchool && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      >
                        <div className="border-t pt-8">
                          <div className="flex flex-col md:flex-row items-center gap-8 bg-primary/5 p-8 rounded-2xl border-2 border-primary/20 transition-all hover:bg-primary/10">
                            <div className="h-24 w-24 bg-white rounded-2xl p-4 shadow-sm border">
                              <img src={foundSchool.logo} alt={foundSchool.name} className="h-full w-full object-contain" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                              <h2 className="text-2xl font-bold">{foundSchool.name}</h2>
                              <p className="text-muted-foreground font-medium">{foundSchool.location}</p>
                              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                <ShieldCheck className="h-3 w-3" />
                                Verified Portal
                              </div>
                            </div>
                            <Button 
                              size="lg" 
                              className="group h-14 px-8 font-bold gap-2"
                              onClick={() => setSelectedSchool(foundSchool)}
                            >
                              Enter Portal
                              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!foundSchool && schoolCode && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 text-center text-red-500 font-medium"
                    >
                      No school found with code "{schoolCode}". Please check and try again.
                    </motion.p>
                  )}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                    <SchoolIcon className="h-6 w-6 text-slate-600" />
                  </div>
                  <p className="font-semibold">Independent Data</p>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-slate-600" />
                  </div>
                  <p className="font-semibold">Secure Access</p>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">
                    <Layout className="h-6 w-6 text-slate-600" />
                  </div>
                  <p className="font-semibold">Unified Dashboard</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
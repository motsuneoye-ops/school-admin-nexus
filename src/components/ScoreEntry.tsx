import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Save, 
  Search,
  CheckCircle2,
  Printer,
  Table as TableIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Subject, Student, DetailedScore } from '@/lib/types';
import { toast } from 'sonner';

interface ScoreEntryProps {
  subject: Subject;
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
  onBack: () => void;
}

export const ScoreEntry: React.FC<ScoreEntryProps> = ({ 
  subject, 
  students, 
  onUpdateStudents, 
  onBack 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Local state for all student scores for this subject
  const [localScores, setLocalScores] = useState<Record<string, DetailedScore>>(() => {
    const initial: Record<string, DetailedScore> = {};
    students.forEach(student => {
      const existing = student.detailedScores?.find(ds => ds.subjectId === subject.id);
      initial[student.id] = existing || {
        subjectId: subject.id,
        test1: 0,
        groupWork: 0,
        test2: 0,
        projectWork: 0,
        examScore: 0,
      };
    });
    return initial;
  });

  const getCalculatedRow = (studentId: string) => {
    const s = localScores[studentId];
    const totalClassScore = (s.test1 || 0) + (s.groupWork || 0) + (s.test2 || 0) + (s.projectWork || 0);
    const classScore50 = totalClassScore * 0.5;
    const examScore50 = (s.examScore || 0) * 0.5;
    const overallTotal = classScore50 + examScore50;
    
    // Grading logic
    let grade = 'F';
    let remark = 'Fail';
    
    if (overallTotal >= 80) { grade = 'A'; remark = 'Excellent'; }
    else if (overallTotal >= 70) { grade = 'B'; remark = 'Very Good'; }
    else if (overallTotal >= 60) { grade = 'C'; remark = 'Good'; }
    else if (overallTotal >= 50) { grade = 'D'; remark = 'Credit'; }
    else if (overallTotal >= 40) { grade = 'E'; remark = 'Pass'; }

    return {
      ...s,
      totalClassScore,
      classScore50,
      examScore50,
      overallTotal,
      grade,
      remark
    };
  };

  // Compute positions across all students in the class for this subject
  const rankedStudents = useMemo(() => {
    const allCalculated = students
      .filter(s => s.grade === subject.grade)
      .map(student => ({
        id: student.id,
        name: student.name,
        photo: student.photo,
        ...getCalculatedRow(student.id)
      }))
      .sort((a, b) => (b.overallTotal || 0) - (a.overallTotal || 0));

    return allCalculated.map((s, index) => ({
      ...s,
      position: index + 1
    }));
  }, [localScores, students, subject.grade, subject.id]);

  const filteredRanked = rankedStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScoreChange = (studentId: string, field: keyof DetailedScore, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    
    // Max value constraints
    let max = 100;
    if (field === 'test1' || field === 'test2') max = 30;
    if (field === 'groupWork' || field === 'projectWork') max = 20;
    
    const finalValue = Math.min(numValue, max);

    setLocalScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: finalValue
      }
    }));
  };

  const handleSave = () => {
    const updatedStudents = students.map(student => {
      if (student.grade !== subject.grade) return student;
      
      const calcRow = rankedStudents.find(rs => rs.id === student.id);
      if (!calcRow) return student;

      const detailedScore: DetailedScore = {
        subjectId: subject.id,
        test1: calcRow.test1,
        groupWork: calcRow.groupWork,
        test2: calcRow.test2,
        projectWork: calcRow.projectWork,
        examScore: calcRow.examScore,
        totalClassScore: calcRow.totalClassScore,
        classScore50: calcRow.classScore50,
        examScore50: calcRow.examScore50,
        overallTotal: calcRow.overallTotal,
        position: calcRow.position,
        grade: calcRow.grade,
        remark: calcRow.remark
      };

      const otherDetailed = student.detailedScores?.filter(ds => ds.subjectId !== subject.id) || [];
      
      // Update the student with new detailed scores
      return {
        ...student,
        detailedScores: [...otherDetailed, detailedScore],
        averageGrade: Math.round(rankedStudents.reduce((acc, curr) => acc + (curr.overallTotal || 0), 0) / rankedStudents.length)
      };
    });

    onUpdateStudents(updatedStudents);
    toast.success(`Scores for ${subject.name} saved and ranked successfully!`, {
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
    });
    onBack();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full border">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <h2 className="text-2xl font-black">{subject.name} Score Sheet</h2>
            <p className="text-muted-foreground font-bold">{subject.code} \u2022 {subject.grade}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 font-bold" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print Sheet
          </Button>
          <Button onClick={handleSave} className="gap-2 font-bold shadow-lg">
            <Save className="h-4 w-4" /> Save All
          </Button>
        </div>
      </div>

      <Card className="border-2 shadow-xl overflow-hidden">
        <CardHeader className="bg-muted/30 border-b pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-black">Academic Performance Tracking</CardTitle>
              <CardDescription className="font-medium">Enter scores for all assessment types. Totals, grades, and positions are calculated in real-time.</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by name..." 
                className="pl-10 font-bold" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800">
                  <TableHead className="w-12 text-center font-black">#</TableHead>
                  <TableHead className="w-12 text-center">Pic</TableHead>
                  <TableHead className="min-w-[150px] font-black">Full Name</TableHead>
                  <TableHead className="bg-blue-50/50 dark:bg-blue-900/10 text-center font-bold">Test 1 (30)</TableHead>
                  <TableHead className="bg-blue-50/50 dark:bg-blue-900/10 text-center font-bold">Group (20)</TableHead>
                  <TableHead className="bg-blue-50/50 dark:bg-blue-900/10 text-center font-bold">Test 2 (30)</TableHead>
                  <TableHead className="bg-blue-50/50 dark:bg-blue-900/10 text-center font-bold">Project (20)</TableHead>
                  <TableHead className="bg-indigo-50 dark:bg-indigo-900/20 text-center font-black">Total Class (100)</TableHead>
                  <TableHead className="bg-indigo-50 dark:bg-indigo-900/20 text-center font-black">50% (A)</TableHead>
                  <TableHead className="bg-emerald-50 dark:bg-emerald-900/10 text-center font-bold">Exam (100)</TableHead>
                  <TableHead className="bg-emerald-50 dark:bg-emerald-900/10 text-center font-black">50% (B)</TableHead>
                  <TableHead className="bg-orange-50 dark:bg-orange-900/10 text-center font-black text-orange-700">Total (A+B)</TableHead>
                  <TableHead className="text-center font-black">Pos</TableHead>
                  <TableHead className="text-center font-black">Grade</TableHead>
                  <TableHead className="text-center font-black">Remark</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRanked.map((row, idx) => (
                  <TableRow key={row.id} className="transition-colors hover:bg-muted/30">
                    <TableCell className="text-center font-bold text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell className="text-center">
                      <img src={row.photo} alt={row.name} className="h-8 w-8 rounded-full object-cover border mx-auto" />
                    </TableCell>
                    <TableCell className="font-black text-sm">{row.name}</TableCell>
                    
                    {/* INPUT FIELDS */}
                    <TableCell className="bg-blue-50/30 dark:bg-blue-900/5 p-1">
                      <Input 
                        type="number" max="30" 
                        className="h-8 text-center border-none focus-visible:ring-0 font-bold"
                        value={row.test1 || ''} 
                        onChange={e => handleScoreChange(row.id, 'test1', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell className="bg-blue-50/30 dark:bg-blue-900/5 p-1">
                      <Input 
                        type="number" max="20" 
                        className="h-8 text-center border-none focus-visible:ring-0 font-bold"
                        value={row.groupWork || ''} 
                        onChange={e => handleScoreChange(row.id, 'groupWork', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell className="bg-blue-50/30 dark:bg-blue-900/5 p-1">
                      <Input 
                        type="number" max="30" 
                        className="h-8 text-center border-none focus-visible:ring-0 font-bold"
                        value={row.test2 || ''} 
                        onChange={e => handleScoreChange(row.id, 'test2', e.target.value)} 
                      />
                    </TableCell>
                    <TableCell className="bg-blue-50/30 dark:bg-blue-900/5 p-1">
                      <Input 
                        type="number" max="20" 
                        className="h-8 text-center border-none focus-visible:ring-0 font-bold"
                        value={row.projectWork || ''} 
                        onChange={e => handleScoreChange(row.id, 'projectWork', e.target.value)} 
                      />
                    </TableCell>
                    
                    {/* CALCULATED FIELDS */}
                    <TableCell className="text-center font-black bg-indigo-50/50 dark:bg-indigo-900/10">
                      {row.totalClassScore}
                    </TableCell>
                    <TableCell className="text-center font-black bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-700">
                      {row.classScore50}
                    </TableCell>
                    
                    <TableCell className="bg-emerald-50/30 dark:bg-emerald-900/5 p-1">
                      <Input 
                        type="number" max="100" 
                        className="h-8 text-center border-none focus-visible:ring-0 font-bold"
                        value={row.examScore || ''} 
                        onChange={e => handleScoreChange(row.id, 'examScore', e.target.value)} 
                      />
                    </TableCell>
                    
                    <TableCell className="text-center font-black bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700">
                      {row.examScore50}
                    </TableCell>
                    <TableCell className="text-center font-black bg-orange-50/50 dark:bg-orange-900/10 text-orange-700 text-lg">
                      {row.overallTotal}
                    </TableCell>
                    
                    <TableCell className="text-center font-black">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-black">
                        {row.position}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 rounded-md text-xs font-black ${
                        row.grade === 'A' ? 'bg-green-100 text-green-700' : 
                        row.grade === 'B' ? 'bg-blue-100 text-blue-700' : 
                        row.grade === 'C' ? 'bg-yellow-100 text-yellow-700' : 
                        row.grade === 'D' ? 'bg-orange-100 text-orange-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {row.grade}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-[10px] font-black uppercase tracking-tight">
                      {row.remark}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredRanked.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <TableIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-bold">No students found in this class.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
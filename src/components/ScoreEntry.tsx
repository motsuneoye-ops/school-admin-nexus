import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Save, 
  User, 
  Search,
  CheckCircle2
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
import { Subject, Student } from '@/lib/types';
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
  
  // Filter students by the subject's grade and search term
  const relevantStudents = students.filter(s => 
    s.grade === subject.grade && 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Local state for scores to allow editing before saving
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initialScores: Record<string, number> = {};
    relevantStudents.forEach(student => {
      const existingGrade = student.subjectGrades.find(sg => sg.subject.toLowerCase() === subject.name.toLowerCase() || sg.subject.toLowerCase() === subject.code.toLowerCase());
      initialScores[student.id] = existingGrade ? existingGrade.grade : 0;
    });
    return initialScores;
  });

  const handleScoreChange = (studentId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 100) {
      setScores(prev => ({
        ...prev,
        [studentId]: numValue
      }));
    }
  };

  const handleSave = () => {
    const updatedStudents = students.map(student => {
      if (student.grade !== subject.grade) return student;
      
      const newScore = scores[student.id] ?? 0;
      
      // Update or add the subject grade
      const existingGradeIndex = student.subjectGrades.findIndex(sg => 
        sg.subject.toLowerCase() === subject.name.toLowerCase() || 
        sg.subject.toLowerCase() === subject.code.toLowerCase()
      );

      let newSubjectGrades = [...student.subjectGrades];
      if (existingGradeIndex >= 0) {
        newSubjectGrades[existingGradeIndex] = { ...newSubjectGrades[existingGradeIndex], grade: newScore };
      } else {
        newSubjectGrades.push({ subject: subject.name, grade: newScore });
      }

      // Recalculate average
      const averageGrade = Math.round(
        newSubjectGrades.reduce((sum, sg) => sum + sg.grade, 0) / newSubjectGrades.length
      );

      return {
        ...student,
        subjectGrades: newSubjectGrades,
        averageGrade
      };
    });

    onUpdateStudents(updatedStudents);
    toast.success(`Scores for ${subject.name} saved successfully!`, {
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
    });
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Enter Scores: {subject.name}</h2>
            <p className="text-muted-foreground">{subject.code} • {subject.grade}</p>
          </div>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save All Scores
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Student Score Sheet</CardTitle>
          <CardDescription>Enter grades (0-100) for all students in this class.</CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search students..." 
              className="pl-10" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Student Name</TableHead>
                  <TableHead>Current Avg</TableHead>
                  <TableHead className="text-right">Score (0-100)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relevantStudents.length > 0 ? (
                  relevantStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          student.averageGrade >= 80 ? 'bg-green-100 text-green-700' : 
                          student.averageGrade >= 60 ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {student.averageGrade}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            className="w-24 text-right"
                            value={scores[student.id] || ''}
                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      No students found in this grade level.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useState } from 'react';
import { 
  Plus, 
  BookOpen, 
  Trash2, 
  MoreVertical,
  Layers,
  Edit3,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Subject, Student } from '@/lib/types';
import { SUBJECTS } from '@/lib/mock-data';
import { toast } from 'sonner';
import { ScoreEntry } from './ScoreEntry';

interface ManageClassesProps {
  students: Student[];
  onUpdateStudents: (students: Student[]) => void;
}

export const ManageClasses: React.FC<ManageClassesProps> = ({ students, onUpdateStudents }) => {
  const [subjects, setSubjects] = useState<Subject[]>(SUBJECTS);
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({});
  const [selectedSubjectForScores, setSelectedSubjectForScores] = useState<Subject | null>(null);
  const [viewMode, setViewMode] = useState<'classes' | 'subjects'>('classes');

  // Extract unique classes from students
  const uniqueClasses = Array.from(new Set(students.map(s => s.grade)));

  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.code) return;
    const subject = {
      ...newSubject,
      id: Math.random().toString(36).substr(2, 9),
    } as Subject;
    setSubjects([...subjects, subject]);
    setIsAdding(false);
    setNewSubject({});
    toast.success('Subject created successfully');
  };

  if (selectedSubjectForScores) {
    return (
      <ScoreEntry 
        subject={selectedSubjectForScores} 
        students={students} 
        onUpdateStudents={onUpdateStudents}
        onBack={() => setSelectedSubjectForScores(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black">{viewMode === 'classes' ? 'Classes Portal' : 'Subjects Portal'}</h2>
          <p className="text-muted-foreground">
            {viewMode === 'classes' 
              ? 'Click on a class to view and manage its assigned subjects.' 
              : 'Manage available subjects across all grade levels.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'classes' ? 'default' : 'outline'} 
            onClick={() => setViewMode('classes')}
            className="font-bold"
          >
            Classes
          </Button>
          <Button 
            variant={viewMode === 'subjects' ? 'default' : 'outline'} 
            onClick={() => setViewMode('subjects')}
            className="font-bold"
          >
            Subjects
          </Button>
          <Button onClick={() => setIsAdding(true)} className="gap-2 font-bold">
            <Plus className="h-4 w-4" /> Create New
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {viewMode === 'classes' ? (
          uniqueClasses.map((className) => (
            <Card 
              key={className} 
              className="cursor-pointer hover:shadow-xl hover:border-primary/30 transition-all border-2 group"
              onClick={() => setViewMode('subjects')}
            >
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Layers className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black">{className}</h3>
                  <p className="text-muted-foreground">{students.filter(s => s.grade === className).length} Students Enrolled</p>
                </div>
                <Button variant="outline" className="mt-4 font-bold rounded-full group-hover:bg-primary group-hover:text-primary-foreground">
                  View Subjects
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          subjects.map((subject) => (
            <Card key={subject.id} className="overflow-hidden transition-all hover:shadow-lg border-2">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="mt-4 font-black">{subject.name}</CardTitle>
                <div className="text-xs font-bold font-mono text-primary/70 uppercase tracking-widest">{subject.code}</div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-6">
                  <Layers className="h-4 w-4" />
                  <span>ASSIGNED TO: {subject.grade}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 font-bold gap-2 shadow-sm" 
                    onClick={() => setSelectedSubjectForScores(subject)}
                  >
                    <Edit3 className="h-4 w-4" />
                    Enter Scores
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      setSubjects(subjects.filter(s => s.id !== subject.id));
                      toast.info('Subject deleted');
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-black">{viewMode === 'classes' ? 'New Class' : 'New Subject'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{viewMode === 'classes' ? 'Class Name' : 'Subject Name'}</Label>
              <Input id="name" placeholder="e.g. Grade 10A" value={newSubject.name || ''} onChange={e => setNewSubject(prev => ({...prev, name: e.target.value}))} />
            </div>
            {viewMode === 'subjects' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="code">Subject Code</Label>
                  <Input id="code" placeholder="e.g. MATH101" value={newSubject.code || ''} onChange={e => setNewSubject(prev => ({...prev, code: e.target.value}))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grade">Target Grade/Class</Label>
                  <Input id="grade" placeholder="e.g. 10th Grade" value={newSubject.grade || ''} onChange={e => setNewSubject(prev => ({...prev, grade: e.target.value}))} />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleAddSubject} className="font-bold">Create {viewMode === 'classes' ? 'Class' : 'Subject'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
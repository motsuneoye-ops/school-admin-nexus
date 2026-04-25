import React, { useState } from 'react';
import { 
  Plus, 
  BookOpen, 
  Trash2, 
  MoreVertical,
  Layers,
  Edit3
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

  const handleAdd = () => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subjects & Score Entry</h2>
          <p className="text-muted-foreground">Manage subjects or select one to enter student scores.</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Subject
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="bg-primary/5 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BookOpen className="h-5 w-5" />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="mt-4">{subject.name}</CardTitle>
              <div className="text-sm font-mono text-muted-foreground">{subject.code}</div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="h-4 w-4" />
                <span>{subject.grade}</span>
              </div>
              <div className="mt-6 flex gap-2">
                <Button 
                  className="flex-1 gap-2" 
                  onClick={() => setSelectedSubjectForScores(subject)}
                >
                  <Edit3 className="h-4 w-4" />
                  Enter Scores
                </Button>
                <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                  setSubjects(subjects.filter(s => s.id !== subject.id));
                  toast.info('Subject deleted');
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Subject</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Subject Name</Label>
              <Input id="name" placeholder="e.g. Advanced Mathematics" value={newSubject.name || ''} onChange={e => setNewSubject(prev => ({...prev, name: e.target.value}))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Subject Code</Label>
              <Input id="code" placeholder="e.g. MATH301" value={newSubject.code || ''} onChange={e => setNewSubject(prev => ({...prev, code: e.target.value}))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="grade">Target Grade</Label>
              <Input id="grade" placeholder="e.g. 10th Grade" value={newSubject.grade || ''} onChange={e => setNewSubject(prev => ({...prev, grade: e.target.value}))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Create Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
import React, { useState } from 'react';
import { 
  Trash2, 
  Edit, 
  Search, 
  UserPlus, 
  Camera, 
  Upload,
  User,
  Mail,
  Hash
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Student } from '@/lib/types';
import { WebcamCapture } from './WebcamCapture';
import { toast } from 'sonner';

interface ManageStudentsProps {
  students: Student[];
  onUpdate: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const ManageStudents: React.FC<ManageStudentsProps> = ({ 
  students, 
  onUpdate, 
  onDelete 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Partial<Student> | null>(null);
  const [showWebcam, setShowWebcam] = useState(false);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedStudent?.name || !selectedStudent?.grade) {
      toast.error('Please fill in required fields');
      return;
    }

    if (selectedStudent?.id) {
      onUpdate(selectedStudent as Student);
      toast.success('Student updated successfully');
    } else {
      const newStudent: Student = {
        ...selectedStudent,
        id: `s-${Math.random().toString(36).substr(2, 9)}`,
        schoolId: students[0]?.schoolId || '1',
        averageGrade: 0,
        performanceTrend: [],
        subjectGrades: [],
        photo: selectedStudent?.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
        email: selectedStudent?.email || '',
      } as Student;
      onUpdate(newStudent);
      toast.success('New student added successfully');
    }
    setIsEditing(false);
  };

  const handlePhotoCapture = (image: string) => {
    setSelectedStudent(prev => prev ? { ...prev, photo: image } : { photo: image });
    toast.info('Photo captured!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedStudent(prev => prev ? { ...prev, photo: reader.result as string } : { photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => { setSelectedStudent({}); setIsEditing(true); }}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">Photo</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Grade Level</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead className="text-right">Performance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No students found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <img 
                      src={student.photo} 
                      alt={student.name} 
                      className="h-10 w-10 rounded-full object-cover border"
                    />
                  </TableCell>
                  <TableCell className="font-semibold">{student.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{student.email}</TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      student.averageGrade >= 80 ? 'bg-green-100 text-green-800' :
                      student.averageGrade >= 65 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.averageGrade}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(student)} className="hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(student.id)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedStudent?.id ? 'Edit Student Details' : 'Register New Student'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col items-center gap-4 bg-muted/30 p-6 rounded-xl">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-background shadow-lg bg-background">
                {selectedStudent?.photo ? (
                  <img src={selectedStudent.photo} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                  <div className="flex gap-2">
                    <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => setShowWebcam(true)}>
                      <Camera className="h-4 w-4" />
                    </Button>
                    <Label htmlFor="photo-upload" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      <Upload className="h-4 w-4" />
                      <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </Label>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Student Profile Photo</p>
                <p className="text-xs text-muted-foreground">Capture with webcam or upload file</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="name" 
                  placeholder="e.g. John Doe"
                  value={selectedStudent?.name || ''} 
                  onChange={(e) => setSelectedStudent(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="grade">Grade Level <span className="text-destructive">*</span></Label>
                  <Input 
                    id="grade" 
                    placeholder="e.g. 10th Grade"
                    value={selectedStudent?.grade || ''} 
                    onChange={(e) => setSelectedStudent(prev => ({ ...prev, grade: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="student@school.edu"
                    value={selectedStudent?.email || ''} 
                    onChange={(e) => setSelectedStudent(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Discard</Button>
            <Button onClick={handleSave} className="px-8">
              {selectedStudent?.id ? 'Update Student' : 'Register Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showWebcam && (
        <WebcamCapture 
          onCapture={handlePhotoCapture} 
          onClose={() => setShowWebcam(false)} 
        />
      )}
    </div>
  );
};
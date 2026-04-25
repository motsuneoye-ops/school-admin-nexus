import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  BookOpen, 
  GraduationCap,
  Trash2,
  Edit
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
import { Teacher } from '@/lib/types';
import { TEACHERS } from '@/lib/mock-data';
import { toast } from 'sonner';

export const ManageTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(TEACHERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Partial<Teacher> | null>(null);

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (selectedTeacher?.id) {
      setTeachers(teachers.map(t => t.id === selectedTeacher.id ? selectedTeacher as Teacher : t));
      toast.success('Teacher updated successfully');
    } else {
      const newTeacher = { ...selectedTeacher, id: Math.random().toString(36).substr(2, 9) } as Teacher;
      setTeachers([...teachers, newTeacher]);
      toast.success('New teacher added successfully');
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teachers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => { setSelectedTeacher({}); setIsEditing(true); }}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Teacher
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Classes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={teacher.photo} alt={teacher.name} className="h-10 w-10 rounded-full object-cover" />
                    <div className="font-medium">{teacher.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-3 w-3" /> {teacher.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="h-3 w-3" /> {teacher.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map(s => (
                      <span key={s} className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {teacher.classes.map(c => (
                      <span key={c} className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        {c}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedTeacher(teacher); setIsEditing(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                      setTeachers(teachers.filter(t => t.id !== teacher.id));
                      toast.error('Teacher removed');
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTeacher?.id ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={selectedTeacher?.name || ''} onChange={e => setSelectedTeacher(prev => ({...prev, name: e.target.value}))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={selectedTeacher?.email || ''} onChange={e => setSelectedTeacher(prev => ({...prev, email: e.target.value}))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={selectedTeacher?.phone || ''} onChange={e => setSelectedTeacher(prev => ({...prev, phone: e.target.value}))} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Subjects (comma separated)</Label>
              <Input 
                value={selectedTeacher?.subjects?.join(', ') || ''} 
                onChange={e => setSelectedTeacher(prev => ({...prev, subjects: e.target.value.split(',').map(s => s.trim())}))} 
                placeholder="Math, Physics, etc."
              />
            </div>
            <div className="grid gap-2">
              <Label>Classes (comma separated)</Label>
              <Input 
                value={selectedTeacher?.classes?.join(', ') || ''} 
                onChange={e => setSelectedTeacher(prev => ({...prev, classes: e.target.value.split(',').map(s => s.trim())}))} 
                placeholder="10th Grade A, 11th Grade B"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
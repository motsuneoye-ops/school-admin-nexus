import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { School } from '@/lib/types';
import { MapPin, Users, School as SchoolIcon, ArrowRight, Plus, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface SuperAdminDashboardProps {
  schools: School[];
  onSelectSchool: (school: School) => void;
  onCreateSchool: (school: School) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ 
  schools, 
  onSelectSchool,
  onCreateSchool
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSchool, setNewSchool] = useState<Partial<School>>({});

  const generateSchoolCode = (name: string) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${random}`;
  };

  const handleCreate = () => {
    if (!newSchool.name || !newSchool.location) {
      toast.error('Please fill in required fields');
      return;
    }

    const school: School = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSchool.name,
      location: newSchool.location,
      logo: newSchool.logo || 'https://via.placeholder.com/150?text=School+Logo',
      studentCount: 0,
      teacherCount: 0,
      code: generateSchoolCode(newSchool.name),
      address: newSchool.address || '',
      email: newSchool.email || '',
      phone: newSchool.phone || '',
    };

    onCreateSchool(school);
    setIsAdding(false);
    setNewSchool({});
    toast.success(`School "${school.name}" created with code: ${school.code}`, {
      duration: 5000,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Network Overview</h1>
          <p className="text-muted-foreground">Manage and monitor all registered schools in the system.</p>
        </div>
        
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="shadow-lg gap-2">
              <Plus className="h-4 w-4" /> Register New School
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Register School</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">School Name *</Label>
                <Input id="name" placeholder="e.g. Horizon High School" value={newSchool.name || ''} onChange={e => setNewSchool({...newSchool, name: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location (City/State) *</Label>
                <Input id="location" placeholder="e.g. Lagos, Nigeria" value={newSchool.location || ''} onChange={e => setNewSchool({...newSchool, location: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logo">Logo URL (optional)</Label>
                <Input id="logo" placeholder="https://..." value={newSchool.logo || ''} onChange={e => setNewSchool({...newSchool, logo: e.target.value})} />
              </div>
              <div className="text-xs text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
                <p className="font-bold flex items-center gap-1 text-primary">
                  <Hash className="h-3 w-3" /> Note:
                </p>
                A unique school code will be automatically generated upon creation.
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create School</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schools.map((school) => (
          <motion.div
            key={school.id}
            whileHover={{ y: -4 }}
            className="cursor-pointer"
            onClick={() => onSelectSchool(school)}
          >
            <Card className="h-full transition-all hover:shadow-xl border-2 hover:border-primary/20">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/10">
                  <img src={school.logo} alt={school.name} className="h-8 w-8 object-contain" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <h3 className="font-bold leading-none truncate">{school.name}</h3>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    {school.location}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Students</span>
                    <div className="flex items-center gap-2 font-bold">
                      <Users className="h-4 w-4 text-primary" />
                      {school.studentCount}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Code</span>
                    <div className="flex items-center gap-2 font-mono text-sm font-bold text-primary">
                      <Hash className="h-3 w-3" />
                      {school.code}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/30 py-3 flex justify-between items-center group rounded-b-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Access Portal</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-primary" />
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
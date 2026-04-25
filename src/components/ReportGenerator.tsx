import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Search,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Student } from '@/lib/types';
import { toast } from 'sonner';

interface ReportGeneratorProps {
  students: Student[];
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleBulkDownload = () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select students first');
      return;
    }
    toast.success(`Preparing PDF reports for ${selectedStudents.length} students...`);
    setTimeout(() => {
      toast.success('Reports downloaded successfully!');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Terminal Report Generator</h2>
          <p className="text-muted-foreground">Generate and export student performance reports.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSelectedStudents(students.map(s => s.id))}>
            Select All
          </Button>
          <Button onClick={handleBulkDownload} disabled={selectedStudents.length === 0}>
            <Download className="mr-2 h-4 w-4" /> Bulk Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Search Student</Label>
                <Input 
                  placeholder="Name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Term</Label>
                <select className="w-full rounded-md border bg-background p-2 text-sm">
                  <option>First Term 2024</option>
                  <option>Second Term 2024</option>
                  <option>Third Term 2024</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold">{selectedStudents.length}</div>
                <p className="text-xs text-muted-foreground">Students Selected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <div className="rounded-xl border bg-card">
            <div className="grid divide-y">
              {filteredStudents.map((student) => (
                <div 
                  key={student.id} 
                  className={`flex items-center justify-between p-4 transition-colors hover:bg-muted/50 cursor-pointer ${
                    selectedStudents.includes(student.id) ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => toggleStudent(student.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-5 w-5 items-center justify-center rounded border ${
                      selectedStudents.includes(student.id) ? 'bg-primary border-primary text-primary-foreground' : 'bg-background'
                    }`}>
                      {selectedStudents.includes(student.id) && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <img src={student.photo} alt="" className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-xs text-muted-foreground">{student.grade} \u2022 Avg: {student.averageGrade}%</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toast.info('Opening print preview...'); }}>
                      <Printer className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toast.success('Report downloaded'); }}>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Label = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);
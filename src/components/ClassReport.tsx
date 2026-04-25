import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Filter, 
  Search,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SUBJECTS } from '@/lib/mock-data';
import { toast } from 'sonner';

export const ClassReport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSubjects = SUBJECTS.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadSheet = (subjectName: string) => {
    toast.success(`Downloading Subject Sheet for ${subjectName}...`);
    setTimeout(() => {
      toast.success('Excel sheet downloaded successfully');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Class / Subject Sheets</h2>
          <p className="text-muted-foreground">Download grade entry sheets for teachers.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">Grade Level</label>
                <select className="w-full rounded-md border bg-background p-2 text-sm">
                  <option>10th Grade</option>
                  <option>11th Grade</option>
                  <option>12th Grade</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Format</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="format" defaultChecked /> Excel (.xlsx)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="format" /> CSV (.csv)
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Filter subjects..."
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredSubjects.map((subject) => (
              <Card key={subject.id} className="group transition-all hover:border-primary">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <FileSpreadsheet className="h-6 w-6" />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="group-hover:bg-primary group-hover:text-primary-foreground"
                      onClick={() => handleDownloadSheet(subject.name)}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-bold">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">{subject.code} \u2022 {subject.grade}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                    <Check className="h-3 w-3" /> Template Ready
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
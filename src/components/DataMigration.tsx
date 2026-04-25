import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Users, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

export const DataMigration: React.FC = () => {
  const [fromClass, setFromClass] = useState('');
  const [toClass, setToClass] = useState('');
  const [isMigrating, setIsMigrating] = useState(false);
  const [step, setStep] = useState(1);

  const handleMigrate = () => {
    if (!fromClass || !toClass) {
      toast.error('Please select both source and destination classes');
      return;
    }
    
    setIsMigrating(true);
    toast.info(`Starting migration from ${fromClass} to ${toClass}...`);
    
    setTimeout(() => {
      setIsMigrating(false);
      setStep(2);
      toast.success('Class migration completed successfully!');
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bulk Data Migration</h2>
        <p className="text-muted-foreground">Move all students from one class to another (e.g., end of year promotion).</p>
      </div>

      {step === 1 ? (
        <div className="grid gap-6">
          <Alert className="bg-amber-50 border-amber-200 text-amber-900">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle>Important Note</AlertTitle>
            <AlertDescription>
              This action will update the grade/class level for ALL students currently enrolled in the source class. This process cannot be automatically undone.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 md:grid-cols-2 items-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Source Class</CardTitle>
                <CardDescription>From</CardDescription>
              </CardHeader>
              <CardContent>
                <select 
                  className="w-full rounded-md border bg-background p-2" 
                  value={fromClass} 
                  onChange={e => setFromClass(e.target.value)}
                >
                  <option value="">Select Class</option>
                  <option value="10th Grade A">10th Grade A</option>
                  <option value="10th Grade B">10th Grade B</option>
                  <option value="11th Grade A">11th Grade A</option>
                </select>
              </CardContent>
            </Card>

            <div className="flex justify-center md:rotate-0 rotate-90">
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Destination Class</CardTitle>
                <CardDescription>To</CardDescription>
              </CardHeader>
              <CardContent>
                <select 
                  className="w-full rounded-md border bg-background p-2" 
                  value={toClass} 
                  onChange={e => setToClass(e.target.value)}
                >
                  <option value="">Select Class</option>
                  <option value="11th Grade A">11th Grade A</option>
                  <option value="11th Grade B">11th Grade B</option>
                  <option value="12th Grade A">12th Grade A</option>
                </select>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button 
              size="lg" 
              onClick={handleMigrate} 
              disabled={isMigrating || !fromClass || !toClass}
              className="w-full md:w-auto"
            >
              {isMigrating ? 'Migrating Students...' : 'Initialize Bulk Migration'}
            </Button>
          </div>
        </div>
      ) : (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-900">Migration Complete</h3>
              <p className="text-green-800">Successfully moved 32 students from {fromClass} to {toClass}.</p>
            </div>
            <Button onClick={() => setStep(1)} variant="outline">Start Another Migration</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Migrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between text-sm border-b pb-2">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">2024-0{i}-15</span>
                  <span className="font-medium">10th Grade {i === 1 ? 'A' : 'B'} \u2192 11th Grade {i === 1 ? 'A' : 'B'}</span>
                </div>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
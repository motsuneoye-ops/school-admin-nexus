import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { School } from '@/lib/types';
import { MapPin, Users, School as SchoolIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuperAdminDashboardProps {
  schools: School[];
  onSelectSchool: (school: School) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ 
  schools, 
  onSelectSchool 
}) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage and monitor all registered schools in the system.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schools.map((school) => (
          <motion.div
            key={school.id}
            whileHover={{ y: -4 }}
            className="cursor-pointer"
            onClick={() => onSelectSchool(school)}
          >
            <Card className="h-full transition-shadow hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <img src={school.logo} alt={school.name} className="h-8 w-8 object-contain" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold leading-none">{school.name}</h3>
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    {school.location}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Students</span>
                    <div className="flex items-center gap-2 font-semibold">
                      <Users className="h-4 w-4 text-primary" />
                      {school.studentCount}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Teachers</span>
                    <div className="flex items-center gap-2 font-semibold">
                      <SchoolIcon className="h-4 w-4 text-primary" />
                      {school.teacherCount}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/30 py-3 flex justify-between items-center group">
                <span className="text-sm font-medium">View Dashboard</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
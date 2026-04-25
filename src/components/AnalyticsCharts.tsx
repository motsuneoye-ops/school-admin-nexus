import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student } from '@/lib/types';

interface AnalyticsChartsProps {
  students: Student[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ students }) => {
  // Aggregate performance data
  const subjectAverages = [
    { subject: 'Math', average: 0 },
    { subject: 'Science', average: 0 },
    { subject: 'History', average: 0 },
    { subject: 'English', average: 0 },
  ];

  students.forEach(student => {
    student.subjectGrades.forEach((sg, idx) => {
      subjectAverages[idx].average += sg.grade;
    });
  });

  subjectAverages.forEach(sa => {
    sa.average = Math.round(sa.average / students.length);
  });

  // Calculate trends (using average of first student for demo trend line)
  const trends = students[0]?.performanceTrend || [];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Average Grades per Subject</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectAverages}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
              />
              <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                {subjectAverages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.average < 70 ? 'var(--destructive)' : 'var(--primary)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>School Performance Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{ r: 4, fill: 'var(--primary)' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
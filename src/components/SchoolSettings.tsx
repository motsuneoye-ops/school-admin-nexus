import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { School } from '@/lib/types';
import { toast } from 'sonner';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Calendar,
  Save
} from 'lucide-react';

interface SchoolSettingsProps {
  school: School;
}

export const SchoolSettings: React.FC<SchoolSettingsProps> = ({ school }) => {
  const [formData, setFormData] = useState<School>(school);

  const handleSave = () => {
    toast.success('School information updated successfully');
  };

  const handleChange = (field: keyof School, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">School Information</h2>
          <p className="text-muted-foreground">Manage your school's public profile and contact details.</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" /> Basic Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">School Name</Label>
              <Input id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="principal">Principal / Headmaster</Label>
              <Input id="principal" value={formData.principal || ''} onChange={e => handleChange('principal', e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="founded">Founded Year</Label>
              <Input id="founded" value={formData.foundedYear || ''} onChange={e => handleChange('foundedYear', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Official Email</Label>
              <Input id="email" type="email" value={formData.email || ''} onChange={e => handleChange('email', e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Physical Address</Label>
              <Input id="address" value={formData.address || ''} onChange={e => handleChange('address', e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School Branding</CardTitle>
          <CardDescription>Update your school logo and brand identity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="h-32 w-32 rounded-xl border bg-muted flex items-center justify-center overflow-hidden">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo" className="h-full w-full object-contain p-2" />
              ) : (
                <Building2 className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <Button variant="outline">Upload New Logo</Button>
              <p className="text-xs text-muted-foreground">Recommended size: 512x512px. PNG or JPG.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const LEADERSHIP_OPTIONS = [
  'Current/Previous Sub-Warden',
  'House Committee Member',
  'Residence Mentor',
  'Floor Representative',
  'Student Governance',
  'Student Council',
  'Faculty Council',
  'UCT Leadership Role',
  'Student Societies Executive',
  'Sports Team Captain/Manager',
  'Tutor/Teaching Assistant',
  'Student Volunteer Program',
  'Peer Mentor Program'
];

interface LeadershipStructureStepProps {
  onComplete: (data: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    studentNumber: string;
    leadershipRoles: string[];
    otherRole?: string;
  }) => void;
}

export const LeadershipStructureStep = ({ onComplete }: LeadershipStructureStepProps) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    studentNumber: '',
    leadershipRoles: [] as string[],
    otherRole: ''
  });
  const [showOtherInput, setShowOtherInput] = useState(false);

  const handleCheckboxChange = (role: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        leadershipRoles: [...prev.leadershipRoles, role]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        leadershipRoles: prev.leadershipRoles.filter(r => r !== role)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      phone: formData.phone,
      studentNumber: formData.studentNumber,
      leadershipRoles: formData.leadershipRoles,
      ...(formData.otherRole && { otherRole: formData.otherRole })
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Roscommon Sub-Warden Application</h2>
        <p className="text-muted-foreground mb-4">
          Step 1: Personal Information & Leadership Experience
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-left text-sm text-blue-700">
          <p className="font-medium">Eligibility Reminder:</p>
          <p>To be eligible, you must be returning as a full-time registered student in 2026 and in good academic standing.</p>
        </div>
      </div>
      <Card className="p-6 mb-8 bg-gradient-card border-0 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="font-medium mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">First Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="surname">Surname *</Label>
                  <Input
                    id="surname"
                    value={formData.surname}
                    onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                    required
                    placeholder="Enter your surname"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    placeholder="+27 12 345 6789"
                  />
                </div>
                <div>
                  <Label htmlFor="studentNumber">Student Number *</Label>
                  <Input
                    id="studentNumber"
                    value={formData.studentNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentNumber: e.target.value }))}
                    required
                    placeholder="e.g. ABCXYZ001"
                    pattern="[A-Za-z0-9]+"
                    title="Please enter a valid student number"
                  />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-medium mb-4">Leadership Structure Participation</h3>
              <p className="text-sm text-muted-foreground">
                Please select all leadership roles you've participated in (if any):
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {LEADERSHIP_OPTIONS.map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox
                      id={role}
                      checked={formData.leadershipRoles.includes(role)}
                      onCheckedChange={(checked) => handleCheckboxChange(role, checked as boolean)}
                    />
                    <Label htmlFor={role} className="text-sm font-normal">
                      {role}
                    </Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="other"
                    checked={showOtherInput}
                    onCheckedChange={(checked) => setShowOtherInput(checked as boolean)}
                  />
                  <Label htmlFor="other" className="text-sm font-normal">
                    Other (please specify)
                  </Label>
                </div>
                {showOtherInput && (
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Please specify your role"
                      value={formData.otherRole || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, otherRole: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>
          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-muted-foreground">
              * Required fields
            </p>
            <Button 
              className="bg-gradient-button hover:opacity-90 transition-opacity"
              size="lg"
              onClick={handleSubmit}
              disabled={!formData.name || !formData.surname || !formData.email || !formData.phone || !formData.studentNumber}
            >
              Continue to Document Upload
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

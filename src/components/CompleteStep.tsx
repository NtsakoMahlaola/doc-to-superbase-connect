import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ExtractedData, ApplicationData, ApplicationInfo } from './ApplicationForm';
import { Loader2 } from 'lucide-react';

interface CompleteStepProps {
  extractedData: ExtractedData;
  onSubmit: (data: ApplicationData) => void;
  onPrevious: () => void;
  isProcessing: boolean;
  applicationInfo?: ApplicationInfo | null;
}

export const CompleteStep = ({ extractedData, onSubmit, onPrevious, isProcessing, applicationInfo }: CompleteStepProps) => {
  const [formData, setFormData] = useState({
    position_applied_for: '',
    why_interested: '',
    terms_accepted: false
  });

  const positions = [
    "Roscommon Sub-Warden 2026",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      ...extractedData,
      leadership: applicationInfo ? [
        ...(extractedData.leadership || []),
        ...(applicationInfo.leadershipRoles || []),
        ...(applicationInfo.otherRole ? [applicationInfo.otherRole] : [])
      ] : extractedData.leadership,
      applicationType: 'Roscommon Sub-Warden 2026'
    });
  };

  const isFormValid = formData.position_applied_for && 
                     formData.why_interested.trim().length > 0 && 
                     formData.terms_accepted;

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-4">Roscommon Sub-Warden Application 2026</h2>
        <p className="text-muted-foreground mb-6">
          Complete your application for the Roscommon Residence Sub-Warden position
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-800 mb-2">Application Requirements</h3>
          <p className="text-sm text-blue-700 mb-2">Please ensure you have included the following in your uploaded document:</p>
          <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
            <li>Your CV</li>
            <li>Motivational letter</li>
            <li>Latest academic transcript</li>
            <li>Names and contact details of two referees</li>
            <li>Reference letter from a person who can attest to your student leadership role</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Position Applied For */}
        <div>
          <Label htmlFor="position" className="text-base font-medium">
            Position Applied For <span className="text-destructive">*</span>
          </Label>
          <Select 
            value={formData.position_applied_for} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, position_applied_for: value }))}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select the position you're applying for" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((position) => (
                <SelectItem key={position} value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Why Interested */}
        <div>
          <Label htmlFor="why_interested" className="text-base font-medium">
            Why are you interested in this role? <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="why_interested"
            value={formData.why_interested}
            onChange={(e) => setFormData(prev => ({ ...prev, why_interested: e.target.value }))}
            placeholder="Please explain your motivation for applying for the Roscommon Sub-Warden position and how your experience aligns with the role requirements..."
            rows={8}
            className="mt-2 resize-none"
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            {formData.why_interested.length}/1000 characters (minimum 300 characters)
          </p>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
          <Checkbox
            id="terms"
            checked={formData.terms_accepted}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, terms_accepted: checked === true }))
            }
            className="mt-1"
            required
          />
          <div>
            <Label htmlFor="terms" className="text-sm font-medium cursor-pointer">
              I confirm that I meet all eligibility criteria and understand the role requirements <span className="text-destructive">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              By submitting this application, I confirm that all information provided is accurate and complete. 
              I understand that false statements may result in disqualification. I agree to the processing of my 
              personal data for recruitment purposes in accordance with UCT's data protection policies.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="space-y-4 w-full pt-6">
          <Button
            type="submit"
            disabled={!isFormValid || isProcessing}
            className="px-8 bg-gradient-button hover:opacity-90 transition-opacity disabled:opacity-50 w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Submitting Application...
              </>
            ) : (
              'Submit Application for Roscommon Sub-Warden'
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Applications closing date to be confirmed in email communication.
          </p>
          
          {!isFormValid && !isProcessing && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Please fill in all required fields to submit your application
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
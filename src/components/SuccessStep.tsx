import { CheckCircle, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const SuccessStep = () => {
  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-card backdrop-blur-glass shadow-card border-0 p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-accent mx-auto animate-pulse" />
        </div>
        
        {/* Success Message */}
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Roscommon Sub-Warden Application Submitted!
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for your interest in the Roscommon Sub-Warden position. We've received your application and will review it carefully. 
          Only shortlisted candidates will be contacted.
        </p>
        
        {/* What Happens Next */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 text-left">
          <h3 className="text-lg font-semibold mb-4 text-blue-800">What happens next in the selection process?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                1
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Application Review</h4>
                <p className="text-sm text-blue-700">Our selection committee will review all applications against the eligibility criteria and role requirements.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                2
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Interview Process</h4>
                <p className="text-sm text-blue-700">Shortlisted candidates will be invited for a competency-based interview in mid-September 2025.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              
            </div>
          </div>
        </div>
        
        {/* Application Reference */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 text-left">
          <h4 className="font-medium text-amber-800 mb-2">Important Notes</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700">
            <li>Please ensure your contact details in the application are correct as we'll use these to reach you</li>
            <li>Check your email regularly, including your spam/junk folder, for any communication from us</li>
            <li>No late applications will be considered after the closing date (3 September 2025)</li>
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
          <p>For any queries about your application, please contact:</p>
          <p className="font-medium text-foreground">Xolani Mkoba - Warden: Roscommon Residence</p>
          <p className="text-foreground">Email: xolani.mkoba@uct.ac.za</p>
        </div>
        
        {/* Contact Information */}
        <div className="mt-8 pt-6 border-t border-muted">
          <p className="text-sm text-muted-foreground">
            Have questions? Contact our HR team at{' '}
            <a href="mhlnts026@myuct.ac.za" className="text-primary hover:underline">
              mhlnts026@myuct.ac.za
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};
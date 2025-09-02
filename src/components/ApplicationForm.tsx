import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StepIndicator } from './StepIndicator';
import { UploadStep } from './UploadStep';
import { ValidateStep } from './ValidateStep';
import { CompleteStep } from './CompleteStep';
import { SuccessStep } from './SuccessStep';
import { LeadershipStructureStep } from './LeadershipStructureStep';
import respublicaLogo from '@/assets/respublica-logo.png';
import uctLogo from '@/assets/uct-logo.png';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export interface ExtractedData {
  experience: string[];
  leadership: string[];
  profile_summary: string;
  education: string[];
  full_name?: string;
  email?: string;
  phone?: string;
}

export interface ApplicationData extends ExtractedData {
  position_applied_for: string;
  why_interested: string;
  terms_accepted: boolean;
  applicationType?: string;
}

export interface ApplicationInfo {
  name: string;
  surname: string;
  studentNumber: string;
  leadershipRoles: string[];
  otherRole?: string;
}

export const ApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [applicationInfo, setApplicationInfo] = useState<ApplicationInfo | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { number: 1, title: 'Application Details', completed: currentStep > 0 },
    { number: 2, title: 'Upload Documents', completed: currentStep > 1 },
    { number: 3, title: 'Complete Application', completed: currentStep > 2 }
  ];

  const extractCVData = async (text: string): Promise<ExtractedData> => {
    // Initialize default data structure
    const extractedData: ExtractedData = {
      experience: [],
      leadership: [],
      profile_summary: '',
      education: []
    };

    // Extract email using regex
    const emailMatch = text.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      extractedData.email = emailMatch[0];
    }

    // Extract phone number (supports various formats)
    const phoneMatch = text.match(/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
    if (phoneMatch) {
      extractedData.phone = phoneMatch[0].trim();
    }

    // Try to extract name (first line that's not empty and doesn't contain email/phone)
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const nameLine = lines.find(line => 
      !line.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) && // Not an email
      !line.match(/\d{10,}/) && // Doesn't contain long numbers (like phone)
      line.split(' ').length <= 4 // Reasonable name length
    );
    
    if (nameLine) {
      extractedData.full_name = nameLine;
    }

    // Extract education (look for common education-related keywords)
    const educationKeywords = ['university', 'college', 'school', 'bachelor', 'master', 'phd', 'bsc', 'msc', 'ba', 'ma'];
    extractedData.education = lines
      .filter(line => 
        educationKeywords.some(keyword => line.toLowerCase().includes(keyword))
      )
      .slice(0, 3); // Limit to 3 most relevant education entries

    // Extract experience (look for job titles and companies)
    const experienceKeywords = ['experience', 'work', 'employment', 'job', 'position'];
    extractedData.experience = lines
      .filter((line, index) => {
        const lowerLine = line.toLowerCase();
        return (
          (lowerLine.includes(' at ') || 
           lowerLine.includes(' - ') || 
           lowerLine.includes(' in ') ||
           experienceKeywords.some(keyword => lowerLine.includes(keyword))) &&
          !educationKeywords.some(keyword => lowerLine.includes(keyword))
        );
      })
      .slice(0, 5); // Limit to 5 most relevant experience entries

    // Extract leadership experience
    const leadershipKeywords = ['lead', 'manage', 'director', 'head', 'president', 'vice president', 'vp'];
    extractedData.leadership = lines
      .filter(line => 
        leadershipKeywords.some(keyword => line.toLowerCase().includes(keyword))
      )
      .slice(0, 3); // Limit to 3 most relevant leadership entries

    // Extract profile summary (first few lines that don't match other categories)
    extractedData.profile_summary = lines
      .slice(0, 10) // Look in first 10 lines
      .filter(line => 
        line.length > 20 && // Reasonable length for a summary
        line.length < 300 &&
        !extractedData.education.includes(line) &&
        !extractedData.experience.includes(line) &&
        !extractedData.leadership.includes(line) &&
        !line.includes('@') && // Not an email
        !line.match(/\d{10,}/) // Not a phone number
      )
      .join(' ')
      .substring(0, 300); // Limit summary length

    return extractedData;
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Dynamically import pdf-parse
    const pdfjsLib = await import('pdf-parse');
    
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);
    
    try {
      // Parse the PDF
      const data = await pdfjsLib.default(typedArray);
      return data.text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF. Please make sure the file is a valid PDF.');
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setUploadedFile(file);
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would extract text from the PDF here
      const mockExtractedData: ExtractedData = {
        experience: ['Mock Experience 1', 'Mock Experience 2'],
        leadership: ['Mock Leadership Role'],
        profile_summary: 'Mock profile summary extracted from CV',
        education: ['Mock Education 1', 'Mock Education 2'],
        full_name: 'Mock Name',
        email: 'mock@example.com',
        phone: '123-456-7890'
      };
      
      setExtractedData(mockExtractedData);
      setCurrentStep(2); // Skip validation step
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: 'Error',
        description: 'Failed to process the uploaded file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (data: ApplicationData) => {
    if (!uploadedFile) {
      toast({
        title: 'Error',
        description: 'No file was uploaded. Please upload your documents first.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Import Airtable function dynamically to avoid issues
      const { saveApplicationToAirtable } = await import('@/lib/airtable');
      
      const fullName = `${applicationInfo?.name || ''} ${applicationInfo?.surname || ''}`.trim();
      
      // Prepare application data for Airtable
      const applicationData = {
        name: fullName || data.full_name || 'Applicant',
        email: data.email || 'no-email@example.com',
        studentNumber: applicationInfo?.studentNumber || '',
        phone: data.phone || '',
        position_applied_for: data.position_applied_for || 'Not specified',
        leadership: [
          ...(data.leadership || []),
          ...(applicationInfo?.leadershipRoles || []),
          ...(applicationInfo?.otherRole ? [applicationInfo.otherRole] : [])
        ],
        education: data.education || [],
        why_interested: data.why_interested || 'Not provided',
        file_name: uploadedFile.name || '',
        created_at: new Date().toISOString()
      };
      
      // Save to Airtable
      const result = await saveApplicationToAirtable(applicationData);
      console.log('Application submitted successfully to Airtable:', result);
      
      // Save to localStorage as backup
      const backupData = {
        ...applicationData,
        submittedAt: new Date().toISOString(),
        id: result.id
      };
      
      const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      existingApplications.push(backupData);
      localStorage.setItem('applications', JSON.stringify(existingApplications));
      
      setApplicationSubmitted(true);
      setCurrentStep(3);
      
      toast({
        title: 'Success!',
        description: 'Your application has been submitted successfully.',
      });
      
    } catch (error) {
      console.error('Error submitting application:', error);
      
      // Fallback: save to localStorage only
      const fullName = `${applicationInfo?.name || ''} ${applicationInfo?.surname || ''}`.trim();
      const fallbackData = {
        name: fullName || data.full_name || 'Applicant',
        email: data.email || 'no-email@example.com',
        studentNumber: applicationInfo?.studentNumber || '',
        phone: data.phone || '',
        position_applied_for: data.position_applied_for || 'Not specified',
        leadership: [
          ...(data.leadership || []),
          ...(applicationInfo?.leadershipRoles || []),
          ...(applicationInfo?.otherRole ? [applicationInfo.otherRole] : [])
        ],
        education: data.education || [],
        why_interested: data.why_interested || 'Not provided',
        file_name: uploadedFile.name || '',
        submittedAt: new Date().toISOString(),
        id: Date.now().toString()
      };
      
      const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      existingApplications.push(fallbackData);
      localStorage.setItem('applications', JSON.stringify(existingApplications));
      
      toast({
        title: 'Application Saved Locally',
        description: 'Application saved to local storage. Set up Airtable for permanent storage.',
        variant: "destructive",
      });
      
      setApplicationSubmitted(true);
      setCurrentStep(3);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplicationInfoSubmit = (data: ApplicationInfo) => {
    setApplicationInfo(data);
    setCurrentStep(1);
  };

  const handleValidationComplete = async (data: ExtractedData) => {
    setIsProcessing(true);
    try {
      // Simulate API call to submit application
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setApplicationSubmitted(true);
      setExtractedData(data);
      
      toast({
        title: "Application Submitted",
        description: "Thank you! Your application has been submitted successfully.",
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  if (applicationSubmitted) {
    return <SuccessStep />;
  }

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gradient-card backdrop-blur-glass shadow-card border-0 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Subwarden Application Portal</h1>
          
          {/* Sponsor Logos */}
          <div className="flex items-center justify-center gap-12 mb-8 px-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <img 
                src={respublicaLogo} 
                alt="Respublica Student Living" 
                className="h-14 object-contain"
              />
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <img 
                src={uctLogo} 
                alt="University of Cape Town" 
                className="h-16 object-contain"
              />
            </div>
          </div>
          
          {/* Step Indicator */}
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 0 && (
            <LeadershipStructureStep 
              onComplete={handleApplicationInfoSubmit}
            />
          )}
          
          {currentStep === 1 && (
            <div className="space-y-8">
              <Card className="p-6 bg-gradient-card border-0 shadow-soft">
                <h3 className="text-xl font-semibold mb-4">Application Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{applicationInfo?.name} {applicationInfo?.surname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Student Number</p>
                    <p className="font-medium">{applicationInfo?.studentNumber}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Leadership Roles</p>
                    <p className="font-medium">
                      {applicationInfo?.leadershipRoles.length 
                        ? applicationInfo.leadershipRoles.join(', ')
                        : 'None specified'}
                      {applicationInfo?.otherRole && `, ${applicationInfo.otherRole}`}
                    </p>
                  </div>
                </div>
              </Card>
              
              <Separator className="my-6" />
              
              <UploadStep 
                onFileUpload={handleFileUpload}
                onPrevious={goToPreviousStep}
                isProcessing={isProcessing}
              />
            </div>
          )}
          
          {currentStep === 2 && extractedData && (
            <CompleteStep 
              extractedData={extractedData}
              onSubmit={handleSubmit}
              onPrevious={goToPreviousStep}
              isProcessing={isProcessing}
              applicationInfo={applicationInfo}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        {!isProcessing && currentStep > 1 && currentStep < 3 && (
          <div className="flex justify-between">
            <Button 
              type="button"
              variant="outline" 
              onClick={goToPreviousStep}
              className="w-full sm:w-auto px-8"
              disabled={isProcessing}
            >
              ← Previous Step
            </Button>
            
            {currentStep === 2 && (
              <Button 
                onClick={goToNextStep}
                className="px-8 bg-gradient-button hover:opacity-90 transition-opacity"
              >
                Next
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
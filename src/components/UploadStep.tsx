import { useState, useRef } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadStepProps {
  onFileUpload: (file: File) => void;
  onPrevious: () => void;
  isProcessing: boolean;
}

export const UploadStep = ({ onFileUpload, onPrevious, isProcessing }: UploadStepProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      onFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (isProcessing) {
    return (
      <div className="text-center py-16">
        <div className="mb-6">
          <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-4">Processing your application...</h3>
        <p className="text-muted-foreground">
          We're extracting information from your CV and cover letter. This may take a few moments.
        </p>
        <div className="mt-8 w-full bg-muted rounded-full h-2">
          <div className="bg-gradient-button h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-left">
      <h2 className="text-2xl font-semibold mb-4">Upload Your Application Documents</h2>
      <p className="text-muted-foreground mb-6">
        Please prepare a single PDF document containing all required materials:
      </p>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">Required Documents (Combined in one PDF):</h3>
        <ul className="list-disc pl-5 text-blue-700 space-y-1 text-sm">
          <li>Your CV</li>
          <li>Motivational letter</li>
          <li>Latest academic transcript</li>
          <li>Names and contact details of two referees</li>
          <li>Reference letter from a person who can attest to your student leadership role</li>
        </ul>
      </div>
      
      {/* Upload Area */}
      <div className="space-y-6 mb-8">
        <div 
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <Upload className="w-12 h-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">
                <span className="text-primary hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Single PDF containing all required documents (max. 10MB)
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-amber-700 text-sm">
          <p className="font-medium">Important Notes:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Ensure all documents are combined into a single PDF file</li>
            <li>Name your file: <span className="font-mono">SURNAME_Initials_Roscommon_SubWarden.pdf</span></li>
            
          </ul>
        </div>
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf"
          className="hidden"
        />
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
        <Button
          type="button"
          onClick={onPrevious}
          variant="outline"
          className="w-full sm:w-auto"
          disabled={isProcessing}
        >
          ← Previous Step
        </Button>
      </div>
    </div>
  );
};
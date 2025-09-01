import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  completed: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div 
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm
                transition-all duration-300 ease-smooth
                ${step.completed 
                  ? 'bg-accent shadow-button' 
                  : step.number === currentStep 
                  ? 'bg-gradient-button shadow-button scale-110' 
                  : 'bg-muted-foreground/50'
                }
              `}
            >
              {step.completed ? (
                <Check className="w-6 h-6" />
              ) : (
                step.number
              )}
            </div>
            
            {/* Step Title */}
            <span 
              className={`
                mt-2 text-sm font-medium text-center max-w-24
                ${step.number === currentStep 
                  ? 'text-primary' 
                  : step.completed 
                  ? 'text-accent' 
                  : 'text-muted-foreground'
                }
              `}
            >
              {step.title}
            </span>
          </div>
          
          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div 
              className={`
                w-16 h-1 mx-4 mb-6 rounded-full transition-all duration-300
                ${step.completed 
                  ? 'bg-accent' 
                  : 'bg-muted-foreground/30'
                }
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
};
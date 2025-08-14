import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const ErrorMessage = ({ title, message, onRetry }: { 
  title?: string; 
  message: string; 
  onRetry?: () => void 
}) => {
  return (
    <Alert variant="destructive" className="max-w-md mx-auto mt-8">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title || 'Error'}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="ml-4 text-sm font-medium underline"
          >
            Retry
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorMessage;

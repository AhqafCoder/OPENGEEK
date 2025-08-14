import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;

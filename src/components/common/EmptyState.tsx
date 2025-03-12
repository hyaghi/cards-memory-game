
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8", 
      className
    )}>
      <div className="text-muted-foreground mb-4 text-4xl">{icon}</div>
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-xs">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;

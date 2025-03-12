
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

const Card = ({ children, className, onClick, interactive = false }: CardProps) => {
  return (
    <div 
      className={cn(
        "bg-card rounded-lg border border-border p-6 shadow-soft transition-all duration-300",
        interactive && "hover:shadow-md hover:translate-y-[-2px] cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;

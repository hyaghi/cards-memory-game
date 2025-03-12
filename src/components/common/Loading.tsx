
import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  text?: string;
}

const Loading = ({ className, text }: LoadingProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-4", className)}>
      <div className="relative h-10 w-10 mb-2">
        <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
      </div>
      {text && <p className="text-sm text-muted-foreground animate-pulse-subtle">{text}</p>}
    </div>
  );
};

export default Loading;

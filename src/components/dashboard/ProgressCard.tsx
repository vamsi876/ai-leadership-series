import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressCardProps {
  title: string;
  progress: number;
  total: number;
  icon: React.ReactNode;
}

export const ProgressCard = ({ title, progress, total, icon }: ProgressCardProps) => {
  const isLoaded = typeof progress === 'number' && typeof total === 'number' && total > 0;
  const percentage = isLoaded ? Math.round((progress / total) * 100) : 0;

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoaded ? `${percentage}%` : '--'}
        </div>
        <p className="text-xs text-muted-foreground">
          {isLoaded ? `${progress} of ${total} complete` : '0 of 0 complete'}
        </p>
        {isLoaded && (
          <div className="progress-bar mt-3">
            <div className="progress-value" style={{ width: `${percentage}%` }}></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressCardProps {
  title: string;
  progress: number;
  total: number;
  icon: React.ReactNode;
}

export const ProgressCard = ({ title, progress, total, icon }: ProgressCardProps) => {
  const percentage = Math.round((progress / total) * 100);
  
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{percentage}%</div>
        <p className="text-xs text-muted-foreground">
          {progress} of {total} complete
        </p>
        <div className="progress-bar mt-3">
          <div className="progress-value" style={{ width: `${percentage}%` }}></div>
        </div>
      </CardContent>
    </Card>
  );
};

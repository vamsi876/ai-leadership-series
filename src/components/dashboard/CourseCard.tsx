
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  image: string;
  modules: number;
}

export const CourseCard = ({ id, title, description, progress, image, modules }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="aspect-video w-full bg-muted relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div 
            className="h-full bg-ai-teal" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between p-4 pt-0">
        <span className="text-sm text-muted-foreground">{modules} Modules</span>
        <Button asChild size="sm">
          <Link to={`/courses/${id}`}>
            {progress > 0 ? 'Continue' : 'Start'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

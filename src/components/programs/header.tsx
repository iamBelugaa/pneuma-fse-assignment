import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

interface IProps {
  isLoading: boolean;
  onRefresh: () => void;
  onAddProgram: () => void;
}

export function DashboardHeader({
  isLoading,
  onRefresh,
  onAddProgram,
}: IProps) {
  return (
    <div className="flex md:items-center md:justify-between md:flex-row flex-col gap-3">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your frequent flyer programs and transfer ratios
        </p>
      </div>
      <div className="flex justify-between md:items-center space-x-2">
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={onRefresh}
          className="md:w-max flex-1"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
        <Button onClick={onAddProgram} className="md:w-max flex-1">
          <Plus className="h-4 w-4 mr-2" />
          Add Program
        </Button>
      </div>
    </div>
  );
}

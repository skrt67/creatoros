import React from 'react';
import { cn } from '@/lib/utils';
import type { VideoStatus, JobStatus, AssetStatus } from '@/types';

interface StatusBadgeProps {
  status: VideoStatus | JobStatus | AssetStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'processing':
      case 'started':
        return 'status-processing';
      case 'completed':
      case 'generated':
        return 'status-completed';
      case 'failed':
        return 'status-failed';
      case 'published':
        return 'bg-primary-100 text-primary-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'status-pending';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'started':
        return 'Started';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'generated':
        return 'Generated';
      case 'published':
        return 'Published';
      case 'archived':
        return 'Archived';
      default:
        return status;
    }
  };

  return (
    <span className={cn(getStatusClasses(status), className)}>
      {getStatusText(status)}
    </span>
  );
};

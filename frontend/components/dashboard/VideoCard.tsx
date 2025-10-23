import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ExternalLink, Trash2 } from 'lucide-react';
import { Card, CardContent, StatusBadge, Button } from '@/components/ui';
import { getYouTubeThumbnail, formatDate, getRelativeTime } from '@/lib/utils';
import type { VideoSource } from '@/types';

interface VideoCardProps {
  video: VideoSource;
  onDelete?: (videoId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onDelete }) => {
  const thumbnail = getYouTubeThumbnail(video.youtube_url, 'medium');
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      onDelete?.(video.id);
    }
  };

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-0">
        <Link href={`/videos/${video.id}`}>
          <div className="relative">
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={video.title || 'Video thumbnail'}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-200">
                  <span className="text-gray-500">No thumbnail</span>
                </div>
              )}
              
              {/* Status overlay */}
              <div className="absolute top-2 right-2">
                <StatusBadge status={video.status} />
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {video.title || 'Untitled Video'}
                </h3>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(video.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{getRelativeTime(video.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center justify-between">
                <a
                  href={video.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Original</span>
                </a>

                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="text-error-600 hover:text-error-700 hover:bg-error-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

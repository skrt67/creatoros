import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Plus, Youtube } from 'lucide-react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { useWorkspaceStore } from '@/store/workspace';
import { validateYouTubeUrl } from '@/lib/utils';

const videoSubmitSchema = z.object({
  youtube_url: z.string()
    .min(1, 'YouTube URL is required')
    .refine(validateYouTubeUrl, 'Please enter a valid YouTube URL'),
});

type VideoSubmitFormData = z.infer<typeof videoSubmitSchema>;

interface VideoSubmitFormProps {
  workspaceId: string;
  onSuccess?: () => void;
}

export const VideoSubmitForm: React.FC<VideoSubmitFormProps> = ({ 
  workspaceId, 
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitVideo } = useWorkspaceStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VideoSubmitFormData>({
    resolver: zodResolver(videoSubmitSchema),
  });

  const onSubmit = async (data: VideoSubmitFormData) => {
    setIsSubmitting(true);
    
    try {
      await submitVideo(workspaceId, data);
      toast.success('Video submitted for processing!');
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to submit video');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Youtube className="h-5 w-5 text-red-600" />
          <span>Submit New Video</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="YouTube URL"
            placeholder="https://www.youtube.com/watch?v=..."
            error={errors.youtube_url?.message}
            helperText="Paste a YouTube video URL to start processing"
            {...register('youtube_url')}
          />
          
          <Button
            type="submit"
            loading={isSubmitting}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Submit Video
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

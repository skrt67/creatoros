import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui';
import { formatDuration } from '@/lib/utils';

interface VideoPlayerProps {
  url: string;
  onProgress?: (progress: { played: number; playedSeconds: number }) => void;
  onSeek?: (seconds: number) => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  onProgress,
  onSeek,
  className = '',
}) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);

  const handleProgress = (progress: { played: number; playedSeconds: number }) => {
    setPlayed(progress.played);
    setPlayedSeconds(progress.playedSeconds);
    onProgress?.(progress);
  };

  const handleSeekTo = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, 'seconds');
      onSeek?.(seconds);
    }
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  const handleFullscreen = () => {
    const playerElement = playerRef.current?.getInternalPlayer();
    if (playerElement && playerElement.requestFullscreen) {
      playerElement.requestFullscreen();
    }
  };

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Video Player */}
      <div className="relative aspect-video">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          playing={playing}
          muted={muted}
          onProgress={handleProgress}
          onDuration={setDuration}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          controls={false}
          config={{
            youtube: {
              playerVars: {
                showinfo: 0,
                controls: 0,
                modestbranding: 1,
                rel: 0,
              },
            },
          }}
        />

        {/* Custom Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
          {/* Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={handlePlayPause}
              className="bg-black/50 text-white hover:bg-black/70 rounded-full p-4"
            >
              {playing ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="relative h-1 bg-white/30 rounded-full cursor-pointer">
                <div
                  className="absolute top-0 left-0 h-full bg-primary-500 rounded-full"
                  style={{ width: `${played * 100}%` }}
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  {playing ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMute}
                  className="text-white hover:bg-white/20"
                >
                  {muted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>

                <span className="text-sm text-white">
                  {formatDuration(playedSeconds)} / {formatDuration(duration)}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

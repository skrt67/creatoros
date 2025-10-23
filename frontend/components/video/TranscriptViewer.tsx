import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock, User, ChevronDown, ChevronRight } from 'lucide-react';
import { Input, Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { formatDuration } from '@/lib/utils';
import type { Transcript } from '@/types';

interface TranscriptViewerProps {
  transcript: Transcript;
  currentTime?: number;
  onSeek?: (seconds: number) => void;
  className?: string;
}

interface WordWithTimestamp {
  text: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: string;
}

interface Chapter {
  summary: string;
  headline: string;
  gist: string;
  start: number;
  end: number;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  transcript,
  currentTime = 0,
  onSeek,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set([0]));
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const words: WordWithTimestamp[] = transcript.full_transcript.words || [];
  const chapters: Chapter[] = transcript.full_transcript.chapters || [];
  const fullText = transcript.full_transcript.text || '';

  // Find active word based on current time
  useEffect(() => {
    if (words.length > 0 && currentTime > 0) {
      const activeIndex = words.findIndex(
        (word, index) => {
          const nextWord = words[index + 1];
          return word.start <= currentTime && (!nextWord || currentTime < nextWord.start);
        }
      );
      setActiveWordIndex(activeIndex);
    }
  }, [currentTime, words]);

  // Auto-scroll to active word
  useEffect(() => {
    if (activeWordIndex >= 0 && scrollRef.current) {
      const activeElement = scrollRef.current.querySelector(`[data-word-index="${activeWordIndex}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [activeWordIndex]);

  const handleWordClick = (word: WordWithTimestamp) => {
    onSeek?.(word.start);
  };

  const handleChapterToggle = (chapterIndex: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterIndex)) {
      newExpanded.delete(chapterIndex);
    } else {
      newExpanded.add(chapterIndex);
    }
    setExpandedChapters(newExpanded);
  };

  const handleChapterSeek = (chapter: Chapter) => {
    onSeek?.(chapter.start);
  };

  const filteredWords = searchTerm
    ? words.filter(word => 
        word.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : words;

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Transcript</span>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Chapters */}
        {chapters.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Chapters</h3>
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleChapterToggle(index)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {expandedChapters.has(index) ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{chapter.headline}</h4>
                        <p className="text-sm text-gray-600">
                          {formatDuration(chapter.start)} - {formatDuration(chapter.end)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChapterSeek(chapter);
                      }}
                    >
                      Jump to
                    </Button>
                  </button>
                  
                  {expandedChapters.has(index) && (
                    <div className="px-3 pb-3 border-t border-gray-100">
                      <p className="text-sm text-gray-700 mt-2">{chapter.summary}</p>
                      {chapter.gist && (
                        <p className="text-xs text-gray-500 mt-1 italic">{chapter.gist}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Transcript */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">Interactive Transcript</h3>
          <div
            ref={scrollRef}
            className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg space-y-2"
          >
            {words.length > 0 ? (
              <div className="leading-relaxed">
                {filteredWords.map((word, index) => {
                  const isActive = index === activeWordIndex;
                  const originalIndex = words.findIndex(w => w === word);
                  
                  return (
                    <span
                      key={`${word.start}-${index}`}
                      data-word-index={originalIndex}
                      onClick={() => handleWordClick(word)}
                      className={`
                        inline-block px-1 py-0.5 mx-0.5 rounded cursor-pointer transition-colors
                        ${isActive 
                          ? 'bg-primary-200 text-primary-900' 
                          : 'hover:bg-gray-200'
                        }
                        ${word.confidence < 0.8 ? 'text-gray-500' : 'text-gray-900'}
                      `}
                      title={`${formatDuration(word.start)} - Confidence: ${Math.round(word.confidence * 100)}%`}
                    >
                      {highlightSearchTerm(word.text)}
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-700 leading-relaxed">
                {highlightSearchTerm(fullText)}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {transcript.full_transcript.summary && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Summary</h3>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                {transcript.full_transcript.summary}
              </p>
            </div>
          </div>
        )}

        {/* Entities */}
        {transcript.full_transcript.entities && transcript.full_transcript.entities.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Key Entities</h3>
            <div className="flex flex-wrap gap-2">
              {transcript.full_transcript.entities.map((entity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {entity.text}
                  <span className="ml-1 text-gray-500">({entity.entity_type})</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

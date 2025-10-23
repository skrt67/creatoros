import React, { useState } from 'react';
import { Copy, Download, Edit3, Eye, FileText, Twitter, Linkedin, Mail, Video } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button, Card, CardHeader, CardTitle, CardContent, StatusBadge } from '@/components/ui';
import { copyToClipboard, formatDate } from '@/lib/utils';
import type { ContentAsset, AssetType } from '@/types';
import { ASSET_TYPE_NAMES } from '@/types';

interface ContentAssetViewerProps {
  assets: ContentAsset[];
  className?: string;
}

const ASSET_ICONS: Record<AssetType, React.ReactNode> = {
  BLOG_POST: <FileText className="h-4 w-4" />,
  TWITTER_THREAD: <Twitter className="h-4 w-4" />,
  LINKEDIN_POST: <Linkedin className="h-4 w-4" />,
  NEWSLETTER: <Mail className="h-4 w-4" />,
  VIDEO_HIGHLIGHTS: <Video className="h-4 w-4" />,
};

export const ContentAssetViewer: React.FC<ContentAssetViewerProps> = ({
  assets,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<AssetType | null>(
    assets.length > 0 ? assets[0].type : null
  );
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');

  const activeAsset = assets.find(asset => asset.type === activeTab);

  const handleCopyToClipboard = async (content: string) => {
    try {
      await copyToClipboard(content);
      toast.success('Content copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy content');
    }
  };

  const handleDownload = (asset: ContentAsset) => {
    const blob = new Blob([asset.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ASSET_TYPE_NAMES[asset.type]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Content downloaded!');
  };

  const handleStartEdit = (asset: ContentAsset) => {
    setEditingAsset(asset.id);
    setEditedContent(asset.content);
  };

  const handleSaveEdit = () => {
    // In a real app, this would make an API call to update the asset
    toast.success('Content updated! (Note: This is a demo - changes are not persisted)');
    setEditingAsset(null);
  };

  const handleCancelEdit = () => {
    setEditingAsset(null);
    setEditedContent('');
  };

  if (assets.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No content assets yet</h3>
          <p className="mt-2 text-sm text-gray-600">
            Content assets will appear here once the video processing is complete.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Generated Content Assets</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {assets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setActiveTab(asset.type)}
                className={`
                  flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${activeTab === asset.type
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {ASSET_ICONS[asset.type]}
                <span>{ASSET_TYPE_NAMES[asset.type]}</span>
                <StatusBadge status={asset.status} className="ml-2" />
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeAsset && (
          <div className="space-y-4">
            {/* Asset Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {ASSET_ICONS[activeAsset.type]}
                  <h3 className="font-medium text-gray-900">
                    {ASSET_TYPE_NAMES[activeAsset.type]}
                  </h3>
                </div>
                <StatusBadge status={activeAsset.status} />
                <span className="text-sm text-gray-500">
                  Created {formatDate(activeAsset.created_at)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyToClipboard(activeAsset.content)}
                >
                  <Copy className="h-4 w-4" />
                  <span className="ml-2">Copy</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(activeAsset)}
                >
                  <Download className="h-4 w-4" />
                  <span className="ml-2">Download</span>
                </Button>
                
                {editingAsset !== activeAsset.id ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartEdit(activeAsset)}
                  >
                    <Edit3 className="h-4 w-4" />
                    <span className="ml-2">Edit</span>
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Display/Editor */}
            <div className="border border-gray-200 rounded-lg">
              {editingAsset === activeAsset.id ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-96 p-4 border-0 resize-none focus:ring-0 focus:outline-none font-mono text-sm"
                  placeholder="Edit your content..."
                />
              ) : (
                <div className="p-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-900 leading-relaxed">
                    {activeAsset.content}
                  </pre>
                </div>
              )}
            </div>

            {/* Content Preview for specific types */}
            {activeAsset.type === 'TWITTER_THREAD' && !editingAsset && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Twitter Thread Preview</h4>
                <div className="space-y-3">
                  {activeAsset.content.split('\n\n').map((tweet, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm text-blue-900">{tweet.trim()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

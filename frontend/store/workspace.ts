import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import type { Workspace, WorkspaceWithVideos, VideoSource, VideoSubmission } from '@/types';

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: WorkspaceWithVideos | null;
  videos: VideoSource[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchWorkspaces: () => Promise<void>;
  createWorkspace: (name: string) => Promise<void>;
  setCurrentWorkspace: (workspaceId: string) => Promise<void>;
  fetchWorkspaceVideos: (workspaceId: string) => Promise<void>;
  submitVideo: (workspaceId: string, videoData: VideoSubmission) => Promise<void>;
  deleteVideo: (videoId: string) => Promise<void>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
  clearError: () => void;
  refreshCurrentWorkspace: () => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  videos: [],
  isLoading: false,
  error: null,

  fetchWorkspaces: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const workspaces = await apiClient.getWorkspaces();
      set({
        workspaces,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch workspaces',
      });
    }
  },

  createWorkspace: async (name: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiClient.createWorkspace(name);
      // Refresh workspaces list
      await get().fetchWorkspaces();
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create workspace',
      });
      throw error;
    }
  },

  setCurrentWorkspace: async (workspaceId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const workspace = await apiClient.getWorkspace(workspaceId);
      set({
        currentWorkspace: workspace,
        videos: workspace.video_sources,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch workspace',
      });
    }
  },

  fetchWorkspaceVideos: async (workspaceId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const videos = await apiClient.getWorkspaceVideos(workspaceId);
      set({
        videos,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch videos',
      });
    }
  },

  submitVideo: async (workspaceId: string, videoData: VideoSubmission) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiClient.submitVideo(workspaceId, videoData);
      
      // Refresh workspace data to show the new video
      await get().setCurrentWorkspace(workspaceId);
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to submit video',
      });
      throw error;
    }
  },

  deleteVideo: async (videoId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiClient.deleteVideo(videoId);
      
      // Remove video from current state
      const { videos, currentWorkspace } = get();
      const updatedVideos = videos.filter(video => video.id !== videoId);
      
      set({
        videos: updatedVideos,
        currentWorkspace: currentWorkspace ? {
          ...currentWorkspace,
          video_sources: updatedVideos
        } : null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete video',
      });
      throw error;
    }
  },

  deleteWorkspace: async (workspaceId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiClient.deleteWorkspace(workspaceId);
      
      // Remove workspace from state
      const { workspaces, currentWorkspace } = get();
      const updatedWorkspaces = workspaces.filter(ws => ws.id !== workspaceId);
      
      set({
        workspaces: updatedWorkspaces,
        currentWorkspace: currentWorkspace?.id === workspaceId ? null : currentWorkspace,
        videos: currentWorkspace?.id === workspaceId ? [] : get().videos,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete workspace',
      });
      throw error;
    }
  },

  refreshCurrentWorkspace: async () => {
    const { currentWorkspace } = get();
    if (currentWorkspace) {
      await get().setCurrentWorkspace(currentWorkspace.id);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

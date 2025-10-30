import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

import type {
  APIResponse,
  User,
  LoginCredentials,
  RegisterData,
  AuthToken,
  Workspace,
  WorkspaceWithVideos,
  VideoSource,
  VideoSubmission,
  JobDetails,
  ContentAsset,
  Transcript,
  Subscription,
  CheckoutRequest
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          Cookies.remove('access_token');
          window.location.href = '/login';
        } else if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.message) {
          toast.error(error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const response: AxiosResponse<AuthToken> = await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<APIResponse> {
    const response: AxiosResponse<APIResponse> = await this.client.post('/auth/register', data);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.client.get('/auth/me');
    return response.data;
  }

  // Workspace endpoints
  async getWorkspaces(): Promise<Workspace[]> {
    const response: AxiosResponse<Workspace[]> = await this.client.get('/workspaces');
    return response.data;
  }

  async createWorkspace(name: string): Promise<APIResponse> {
    const response: AxiosResponse<APIResponse> = await this.client.post('/workspaces', { name });
    return response.data;
  }

  async getWorkspace(workspaceId: string): Promise<WorkspaceWithVideos> {
    const response: AxiosResponse<WorkspaceWithVideos> = await this.client.get(`/workspaces/${workspaceId}`);
    return response.data;
  }

  async deleteWorkspace(workspaceId: string): Promise<APIResponse> {
    const response: AxiosResponse<APIResponse> = await this.client.delete(`/workspaces/${workspaceId}`);
    return response.data;
  }

  // Video endpoints
  async submitVideo(workspaceId: string, videoData: VideoSubmission): Promise<APIResponse> {
    const response: AxiosResponse<APIResponse> = await this.client.post(
      `/workspaces/${workspaceId}/videos`,
      videoData
    );
    return response.data;
  }

  async getWorkspaceVideos(workspaceId: string): Promise<VideoSource[]> {
    const response: AxiosResponse<VideoSource[]> = await this.client.get(`/workspaces/${workspaceId}/videos`);
    return response.data;
  }

  async getVideo(videoId: string): Promise<VideoSource> {
    const response: AxiosResponse<VideoSource> = await this.client.get(`/videos/${videoId}`);
    return response.data;
  }

  async deleteVideo(videoId: string): Promise<APIResponse> {
    const response: AxiosResponse<APIResponse> = await this.client.delete(`/videos/${videoId}`);
    return response.data;
  }

  // Job endpoints
  async getJob(jobId: string): Promise<JobDetails> {
    const response: AxiosResponse<JobDetails> = await this.client.get(`/jobs/${jobId}`);
    return response.data;
  }

  async getJobAssets(jobId: string): Promise<ContentAsset[]> {
    const response: AxiosResponse<ContentAsset[]> = await this.client.get(`/jobs/${jobId}/assets`);
    return response.data;
  }

  async getJobTranscript(jobId: string): Promise<Transcript> {
    const response: AxiosResponse<Transcript> = await this.client.get(`/jobs/${jobId}/transcript`);
    return response.data;
  }

  async getAsset(assetId: string): Promise<ContentAsset> {
    const response: AxiosResponse<ContentAsset> = await this.client.get(`/jobs/assets/${assetId}`);
    return response.data;
  }

  // Billing endpoints
  async createCheckoutSession(data: CheckoutRequest): Promise<{ session_url: string; session_id: string }> {
    const response = await this.client.post('/billing/create-checkout-session', data);
    return response.data;
  }

  async createPortalSession(returnUrl: string): Promise<{ portal_url: string }> {
    const response = await this.client.post('/billing/create-portal-session', { return_url: returnUrl });
    return response.data;
  }

  async getSubscription(): Promise<Subscription> {
    const response: AxiosResponse<Subscription> = await this.client.get('/billing/subscription');
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

// Create singleton instance
export const apiClient = new APIClient();

// Utility functions
export const setAuthToken = (token: string, expiresIn: number) => {
  const expirationDate = new Date(Date.now() + expiresIn * 1000);
  Cookies.set('access_token', token, { expires: expirationDate, secure: true, sameSite: 'strict' });
};

export const removeAuthToken = () => {
  Cookies.remove('access_token');
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get('access_token');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

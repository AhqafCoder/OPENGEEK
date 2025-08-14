import axios, { AxiosRequestConfig } from 'axios';
import { getAuthToken, isTokenStale, requestFreshToken } from './token-manager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to check if this is a long operation that needs fresh token
const isLongOperation = (config: AxiosRequestConfig) => {
  const longOperationPaths = ['/posts', '/projects', '/users/profile'];
  const isFormData = config.headers?.['Content-Type']?.includes('multipart/form-data');
  const isLongPath = longOperationPaths.some(path => config.url?.includes(path));
  const isWriteOperation = ['POST', 'PUT', 'PATCH'].includes(config.method?.toUpperCase() || '');

  return (isFormData || (isLongPath && isWriteOperation));
};

// Add Clerk token to requests with proactive refresh for long operations
api.interceptors.request.use(async (config) => {
  // For long operations, request a fresh token proactively
  if (isLongOperation(config)) {
    console.log('Long operation detected, requesting fresh token...');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('token-refresh-needed'));
      // Give a moment for the token to refresh
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Enhanced response interceptor with retry logic for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // For 401 errors, try to refresh token once before giving up
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('401 error detected, attempting token refresh...');

      if (typeof window !== 'undefined') {
        // Request fresh token
        window.dispatchEvent(new CustomEvent('token-refresh-needed'));

        // Wait a bit for token refresh
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get the refreshed token
        const newToken = getAuthToken();

        if (newToken) {
          console.log('Retrying request with fresh token...');
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      }

      // If token refresh failed, redirect to sign-in
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    }

    return Promise.reject(error);
  }
);

// API functions
export const postsAPI = {
  // Get all posts with pagination
  getPosts: async (params?: {
    page?: number;
    limit?: number;
    sort?: 'created_at' | 'likes_count';
    order?: 'asc' | 'desc';
  }) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  // Get single post
  getPost: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create new post with fresh token guarantee for image uploads
  createPost: async (data: { content: string; image?: File }) => {
    return withFreshToken(async () => {
      const formData = new FormData();
      formData.append('content', data.content);

      if (data.image) {
        formData.append('image', data.image);
        console.log('Uploading post with image (fresh token):', {
          contentLength: data.content.length,
          imageName: data.image.name,
          imageSize: data.image.size,
          imageType: data.image.type
        });
      } else {
        console.log('Creating post without image (fresh token)');
      }

      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // Increased to 60 second timeout for image uploads
      });
      return response.data;
    });
  },

  // Update post
  updatePost: async (id: string, data: { content: string }) => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  // Delete post
  deletePost: async (id: string) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Like/unlike post
  likePost: async (id: string) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },

  // Get post comments
  getComments: async (postId: string, params?: { page?: number; limit?: number }) => {
    const response = await api.get(`/posts/${postId}/comments`, { params });
    return response.data;
  },

  // Add comment to post
  addComment: async (postId: string, data: { content: string; parentId?: string }) => {
    const response = await api.post(`/posts/${postId}/comments`, data);
    return response.data;
  },
};

export const projectsAPI = {
  // Get all projects with filtering and pagination
  getProjects: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    language?: string;
    featured?: string;
    sortBy?: string;
  }) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  // Get single project by ID
  getProject: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create new project with fresh token guarantee
  createProject: async (data: {
    title: string;
    description: string;
    githubUrl: string;
    liveUrl?: string;
    imageUrl?: string;
    tags: string[];
    language: string;
  }) => {
    return withFreshToken(async () => {
      console.log('Creating project with fresh token...');
      const response = await api.post('/projects', data);
      return response.data;
    });
  },

  // Update project
  updateProject: async (id: string, data: {
    title?: string;
    description?: string;
    githubUrl?: string;
    liveUrl?: string;
    tags?: string[];
    language?: string;
  }) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  // Delete project
  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Star/unstar project
  starProject: async (id: string) => {
    const response = await api.post(`/projects/${id}/star`);
    return response.data;
  },
};

// Helper function for critical operations that need fresh tokens
const withFreshToken = async <T>(operation: () => Promise<T>): Promise<T> => {
  // If token is stale, request a fresh one and wait
  if (isTokenStale()) {
    console.log('Token is stale, requesting fresh token before critical operation...');
    requestFreshToken();
    // Wait for token refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return operation();
};

export const usersAPI = {
  // Debug token verification
  debugToken: async () => {
    const response = await api.get('/users/debug/token');
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/profile/me');
    return response.data;
  },

  // Update user profile with fresh token guarantee
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    bio?: string;
    location?: string;
    website?: string;
    githubUsername?: string;
    twitterUsername?: string;
    linkedinUsername?: string;
  }) => {
    return withFreshToken(async () => {
      console.log('Updating profile with fresh token...');
      const response = await api.put('/users/profile', data);
      return response.data;
    });
  },

  // Get user profile by username
  getUserProfile: async (username: string) => {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },

  // Get user posts
  getUserPosts: async (username: string, params?: { page?: number; limit?: number }) => {
    const response = await api.get(`/users/${username}/posts`, { params });
    return response.data;
  },

  // Follow/unfollow user
  followUser: async (username: string) => {
    const response = await api.post(`/users/${username}/follow`);
    return response.data;
  },

  // Get follow status
  getFollowStatus: async (username: string) => {
    const response = await api.get(`/users/${username}/follow-status`);
    return response.data;
  },

  // Get user's followers
  getFollowers: async (username: string, params?: { page?: number; limit?: number }) => {
    const response = await api.get(`/users/${username}/followers`, { params });
    return response.data;
  },

  // Get users that this user follows
  getFollowing: async (username: string, params?: { page?: number; limit?: number }) => {
    const response = await api.get(`/users/${username}/following`, { params });
    return response.data;
  },
};

export default api;
import axios from 'axios';
import { getAuthToken } from './token-manager';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Clerk token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = getAuthToken();
    
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  
  return config;
});

// Response interceptor for error handling with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log('Token expired, attempting to refresh...');
      
      // Try to get a fresh token
      try {
        // Trigger a token refresh by dispatching a custom event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('token-refresh-needed'));
        }
        
        // Wait a bit for the token to be refreshed
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newToken = getAuthToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      
      // If refresh failed, redirect to login
      console.error('Authentication failed - redirecting to login');
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

  // Create new post
  createPost: async (data: { content: string; image?: File }) => {
    const formData = new FormData();
    formData.append('content', data.content);
    
    if (data.image) {
      formData.append('image', data.image);
      console.log('Uploading post with image:', {
        contentLength: data.content.length,
        imageName: data.image.name,
        imageSize: data.image.size,
        imageType: data.image.type
      });
    } else {
      console.log('Uploading post without image');
    }

    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout for image uploads
    });
    return response.data;
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

  // Create new project
  createProject: async (data: {
    title: string;
    description: string;
    githubUrl: string;
    liveUrl?: string;
    imageUrl?: string;
    tags: string[];
    language: string;
  }) => {
    const response = await api.post('/projects', data);
    return response.data;
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

  // Update user profile
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
    const response = await api.put('/users/profile', data);
    return response.data;
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
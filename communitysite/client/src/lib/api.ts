import axios from 'axios';
import { auth } from '@clerk/nextjs/server';

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
    // For client-side requests
    if (typeof window !== 'undefined') {
      const { getToken } = await import('@clerk/nextjs');
      const token = await getToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login');
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
    }

    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
  // Get all projects
  getProjects: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  // Create new project
  createProject: async (data: any) => {
    const response = await api.post('/projects', data);
    return response.data;
  },
};

export const usersAPI = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: any) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};

export default api;
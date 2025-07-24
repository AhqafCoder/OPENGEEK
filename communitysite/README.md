# 🚀 OPENGEEK Community Platform

A modern, full-stack community platform built with Next.js, Express.js, PostgreSQL, and Clerk authentication. Features dynamic posts, user authentication, project showcase, and real-time interactions.

![OPENGEEK Community](https://img.shields.io/badge/OPENGEEK-Community-emerald?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?style=for-the-badge&logo=postgresql)
![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?style=for-the-badge)

## ✨ Features

### 🎯 **Core Features**
- **Dynamic Posts System** - Create, like, and comment on posts with image support
- **User Authentication** - Secure sign-in/sign-up with Clerk integration
- **Projects Showcase** - Browse and discover community projects
- **Real-time Interactions** - Like posts with instant feedback
- **Responsive Design** - Mobile-first, dark theme throughout
- **Image Uploads** - Cloudinary integration for seamless image handling

### 🔧 **Technical Features**
- **Full-Stack TypeScript** - Type safety across frontend and backend
- **RESTful API** - Comprehensive API with proper error handling
- **Database Integration** - PostgreSQL with optimized queries
- **Security** - Rate limiting, input validation, CORS protection
- **Performance** - Optimized loading, pagination, and caching
- **Error Handling** - Comprehensive error boundaries and fallbacks

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (Express)     │◄──►│ (PostgreSQL)    │
│                 │    │                 │    │                 │
│ • React 19      │    │ • Node.js       │    │ • Posts         │
│ • TypeScript    │    │ • Express       │    │ • Users         │
│ • Tailwind CSS  │    │ • Clerk Auth    │    │ • Projects      │
│ • Clerk Auth    │    │ • Cloudinary    │    │ • Comments      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd communitysite

# Run the quick start script
./quick-start.sh
```

### Option 2: Manual Setup

1. **Install Dependencies**
   ```bash
   # Backend
   cd server && npm install
   
   # Frontend
   cd ../client && npm install
   ```

2. **Setup Environment Variables**
   ```bash
   # Backend
   cp server/.env.example server/.env
   
   # Frontend - create client/.env.local
   ```

3. **Setup Database**
   ```bash
   createdb opengeek_community
   cd server
   npm run setup --seed
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev
   
   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

## 📋 Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** 14+
- **Clerk Account** (for authentication)
- **Cloudinary Account** (optional, for image uploads)

## 🔧 Configuration

### Environment Variables

#### Backend (`server/.env`)
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/opengeek_community

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000
```

#### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
```

## 📚 API Documentation

### Posts Endpoints
- `GET /api/posts` - Get posts feed with pagination
- `POST /api/posts` - Create new post (with image upload)
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post (owner only)
- `DELETE /api/posts/:id` - Delete post (owner only)
- `POST /api/posts/:id/like` - Like/unlike post
- `GET /api/posts/:id/comments` - Get post comments
- `POST /api/posts/:id/comments` - Add comment

### Projects Endpoints
- `GET /api/projects` - Get projects showcase
- `POST /api/projects` - Submit new project

### Health Check
- `GET /api/health` - Server health status

## 🎨 UI Components

### Custom Components
- **CreatePost** - Rich post creation with image upload
- **PostCard** - Interactive post display with like functionality
- **ProjectCard** - Project showcase cards
- **PostSkeleton** - Loading states for better UX
- **ErrorBoundary** - Error handling and recovery

### Design System
- **Dark Theme** - Consistent dark UI throughout
- **Emerald Accents** - Brand color for highlights
- **Responsive Layout** - Mobile-first design
- **Smooth Animations** - Framer Motion integration

## 🗄️ Database Schema

```sql
-- Users (synced from Clerk)
users (id, email, username, full_name, image_url, ...)

-- Posts
posts (id, user_id, content, image_url, likes_count, comments_count, ...)

-- Post Interactions
post_likes (id, post_id, user_id, created_at)
post_comments (id, post_id, user_id, content, parent_id, ...)

-- Projects
projects (id, user_id, title, description, github_url, live_url, ...)
project_stars (id, project_id, user_id, created_at)
```

## 🧪 Testing

```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Configure production database
3. Set up proper CORS origins
4. Use process manager (PM2)

### Frontend Deployment
1. Build: `npm run build`
2. Deploy to Vercel/Netlify
3. Update API URL in environment

## 📊 Performance

- **Optimized Images** - Next.js Image optimization
- **Database Indexing** - Proper indexes for fast queries
- **Pagination** - Efficient data loading
- **Caching** - API response caching
- **Bundle Optimization** - Tree shaking and code splitting

## 🔒 Security

- **Authentication** - Clerk-based secure auth
- **Input Validation** - Comprehensive validation
- **Rate Limiting** - API abuse prevention
- **CORS Protection** - Proper origin configuration
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Content sanitization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: See [SETUP.md](SETUP.md) for detailed setup
- **Issues**: Create an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

## 🙏 Acknowledgments

- **Clerk** - Authentication platform
- **Cloudinary** - Image management
- **Vercel** - Deployment platform
- **PostgreSQL** - Database system
- **Next.js Team** - Amazing framework

---

<div align="center">

**Built with ❤️ by the OPENGEEK Community**

[Website](https://opengeek.dev) • [Documentation](./SETUP.md) • [Contributing](./CONTRIBUTING.md)

</div>
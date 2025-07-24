# OPENGEEK Community Setup Guide

This guide will help you set up the complete OPENGEEK Community platform with dynamic posts, user authentication, and backend integration.

## 🏗️ Architecture Overview

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, and Clerk authentication
- **Backend**: Node.js with Express, PostgreSQL, and Clerk integration
- **Database**: PostgreSQL with comprehensive schema for posts, users, projects
- **File Storage**: Cloudinary for image uploads
- **Authentication**: Clerk for secure user management

## 📋 Prerequisites

Before starting, make sure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **Clerk Account** (for authentication)
- **Cloudinary Account** (for image uploads - optional)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd communitysite

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Set Up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Get your keys from the API Keys section
4. Note down:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

### 3. Set Up Database

```bash
# Create PostgreSQL database
createdb opengeek_community

# Or using psql
psql -U postgres
CREATE DATABASE opengeek_community;
\q
```

### 4. Configure Environment Variables

#### Backend Configuration (`server/.env`)

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/opengeek_community
DB_HOST=localhost
DB_PORT=5432
DB_NAME=opengeek_community
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_secret_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend Configuration (`client/.env.local`)

```bash
cd ../client
```

Edit `client/.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

### 5. Set Up Database Schema

```bash
cd ../server

# Run migrations and seed sample data
npm run setup --seed

# Or run individually
npm run migrate  # Create tables
npm run seed     # Add sample data
```

### 6. Start the Applications

#### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```

#### Terminal 2 - Frontend Application
```bash
cd client
npm run dev
```

## 🎯 What You'll Have

After setup, you'll have:

### ✅ **Dynamic Posts System**
- Create new posts with text and images
- Like and comment on posts
- Real-time updates from database
- Pagination and sorting

### ✅ **User Authentication**
- Secure sign-in/sign-up with Clerk
- User profiles and avatars
- Protected routes and actions

### ✅ **Projects Showcase**
- Browse community projects
- Filter and search functionality
- Project details and links

### ✅ **Responsive Design**
- Mobile-friendly interface
- Dark theme throughout
- Smooth animations and transitions

## 🔧 API Endpoints Available

### Posts
- `GET /api/posts` - Get posts feed
- `POST /api/posts` - Create new post (with image upload)
- `POST /api/posts/:id/like` - Like/unlike post
- `GET /api/posts/:id/comments` - Get comments
- `POST /api/posts/:id/comments` - Add comment

### Projects
- `GET /api/projects` - Get projects showcase
- `POST /api/projects` - Submit new project

### Health
- `GET /api/health` - Server health check

## 🎨 Key Features

### Create Posts
- Rich text content (up to 2000 characters)
- Image upload support via Cloudinary
- Real-time character counter
- Instant posting with optimistic updates

### Interactive Feed
- Like posts with heart animation
- Comment system (coming soon)
- Sort by newest or most popular
- Infinite scroll pagination

### User Experience
- Toast notifications for actions
- Loading states and error handling
- Responsive design for all devices
- Smooth animations and transitions

## 🔍 Testing the Setup

1. **Backend Health Check**:
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Frontend Access**:
   - Open http://localhost:3000
   - Sign up/sign in with Clerk
   - Create a new post
   - Like existing posts

3. **Database Verification**:
   ```bash
   psql -d opengeek_community -c "SELECT COUNT(*) FROM posts;"
   ```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Failed
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

#### Clerk Authentication Errors
- Verify Clerk keys are correct
- Check if keys match between frontend and backend
- Ensure Clerk app is configured properly

#### Image Upload Issues
- Verify Cloudinary credentials
- Check file size limits (5MB max)
- Ensure supported file types (JPEG, PNG, GIF, WebP)

#### CORS Errors
- Check `FRONTEND_URL` in backend `.env`
- Ensure ports match (3000 for frontend, 5000 for backend)

### Useful Commands

```bash
# Reset database
cd server
npm run db:reset

# Check server logs
npm run dev

# Build for production
cd ../client
npm run build

# Check API health
curl http://localhost:5000/api/health
```

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Configure production database
3. Set up proper CORS origins
4. Use process manager (PM2)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update API URL in environment variables

## 📚 Next Steps

After basic setup, you can:

1. **Add Comments System**: Implement nested comments
2. **User Profiles**: Create detailed user profile pages
3. **Real-time Updates**: Add WebSocket support
4. **Push Notifications**: Implement notification system
5. **Advanced Search**: Add full-text search capabilities
6. **Content Moderation**: Add admin panel and moderation tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

🎉 **Congratulations!** You now have a fully functional community platform with dynamic posts, user authentication, and backend integration!

For support or questions, please create an issue in the repository.
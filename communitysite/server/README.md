# OPENGEEK Community Server

Backend API server for the OPENGEEK Community Platform built with Node.js, Express, PostgreSQL, and Clerk authentication.

## 🚀 Features

- **Authentication & Authorization**: Clerk-based authentication with secure user management
- **User Management**: User profiles, following system, reputation scoring
- **Project Showcase**: CRUD operations for community projects
- **Community Feed**: Posts, comments, likes, and bookmarks
- **Real-time Features**: Socket.io integration for live updates
- **File Uploads**: Cloudinary integration for image handling
- **Security**: Rate limiting, input validation, SQL injection protection
- **Database**: PostgreSQL with connection pooling and transactions

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Redis (optional, for caching)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd communitysite/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb opengeek_community
   
   # Run migrations
   npm run migrate
   
   # Seed sample data (optional)
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🗄️ Database Schema

### Core Tables

- **users**: User profiles and authentication
- **projects**: Community project showcase
- **posts**: Community feed posts
- **comments**: Comments on posts and projects
- **likes**: Like system for posts, comments, and projects
- **follows**: User following relationships
- **bookmarks**: User bookmarks for posts and projects
- **notifications**: User notifications
- **project_collaborators**: Project collaboration management

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **member**: Regular community member
- **moderator**: Can moderate content
- **admin**: Full system access

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/:username` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/:id/follow` - Follow/unfollow user
- `GET /api/users/:id/followers` - Get user followers
- `GET /api/users/:id/following` - Get user following

### Projects
- `GET /api/projects` - Get all projects (with filtering)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `POST /api/projects/:id/like` - Like/unlike project
- `POST /api/projects/:id/bookmark` - Bookmark/unbookmark project

### Posts
- `GET /api/posts` - Get community feed
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post
- `GET /api/posts/:id/comments` - Get post comments
- `POST /api/posts/:id/comments` - Add comment to post

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `CLOUDINARY_*` | Cloudinary config for file uploads | - |
| `REDIS_URL` | Redis connection string | - |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start index.js --name "opengeek-api"

# Monitor
pm2 monit

# Restart
pm2 restart opengeek-api
```

### Using Docker

```bash
# Build image
docker build -t opengeek-api .

# Run container
docker run -p 5000:5000 --env-file .env opengeek-api
```

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Validates all user inputs
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content sanitization
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet.js**: Security headers
- **JWT Authentication**: Secure token-based auth

## 📊 Monitoring & Logging

- **Morgan**: HTTP request logging
- **Health Check**: `/health` endpoint for monitoring
- **Error Handling**: Centralized error handling
- **Database Logging**: Query performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the OPENGEEK team or create an issue in the repository.

---

Made with ❤️ by the OPENGEEK Community

<div align="center">
  <img src="https://www.opengeek.in/banner.png" alt="OpenGeek Banner" style="width:100%; max-width:800px;"/>
  
  # 🌟 OPENGEEK – India's Premier Tech Community 🚀

  [![Stars](https://img.shields.io/github/stars/AhqafCoder/OPENGEEK?style=social)](https://github.com/AhqafCoder/OPENGEEK/stargazers)
  [![Forks](https://img.shields.io/github/forks/AhqafCoder/OPENGEEK?style=social)](https://github.com/AhqafCoder/OPENGEEK/network)
  [![Contributors](https://img.shields.io/github/contributors/AhqafCoder/OPENGEEK)](https://github.com/AhqafCoder/OPENGEEK/graphs/contributors)
  [![License](https://img.shields.io/github/license/AhqafCoder/OPENGEEK)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
  [![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?logo=clerk)](https://clerk.com/)

  **Empowering student developers through real-world projects, mentorship, and community collaboration**

  [🌐 Visit Website](https://www.opengeek.in) • [💬 Join Discord](https://discord.gg/WsmZ6eupnk) • [📱 Follow Instagram](https://instagram.com/opengeek.in) • [🚀 Get Started](#-quick-start)

</div>

---

## 🎯 What is OpenGeek?

**OpenGeek** is India's fastest-growing tech community for student developers, built by students, for students. We bridge the gap between academic learning and industry experience through:

- 🚀 **Real-world projects** with actual impact
- 👥 **Peer-to-peer mentorship** and collaboration
- 💼 **Internship and job opportunities** 
- 🏆 **Hackathons and coding competitions**
- 📚 **Skill development workshops** and bootcamps
- 🌐 **Open source contributions** and portfolio building

### 🌟 Why Choose OpenGeek?

| Feature | Description |
|---------|-------------|
| **🎓 Student-Centric** | Built specifically for college students and recent graduates |
| **💡 Project-Based Learning** | Learn by building real applications that matter |
| **🤝 Community Support** | 24/7 peer support and mentorship network |
| **🚀 Career Growth** | Direct connections to internships and job opportunities |
| **🏆 Recognition** | Showcase your work and get recognized for contributions |
| **📈 Skill Tracking** | Track your progress and build a strong developer portfolio | 


## 📁 Repository Structure

This monorepo contains all apps, platforms, and tools under the OpenGeek initiative.

```
OPENGEEK/
│
├── admin/                     # 🔧 Admin dashboard (React + Vite)
│   ├── client/                # Admin frontend (React + TypeScript + Vite)
│   │   ├── src/               # Admin app source code
│   │   ├── public/            # Static assets
│   │   ├── components.json    # UI/component library config
│   │   ├── vite.config.ts     # Vite configuration
│   │   ├── tsconfig.json      # TypeScript configuration
│   │   └── package.json       # Frontend dependencies
│   │
│   └── server/                # Admin backend (Express.js)
│       ├── index.js           # Admin API entry point
│       └── package.json       # Backend dependencies
│
├── communitysite/             # ✅ Main fullstack app (Client + Server)
│   ├── client/                # Frontend (Next.js + Tailwind + TypeScript)
│   │   ├── src/               # Main app source code (components, pages, utils)
│   │   ├── public/            # Static assets (favicon, logos, images)
│   │   ├── .next/             # Next.js build output
│   │   ├── components.json    # UI/component library config
│   │   ├── eslint.config.mjs  # ESLint configuration
│   │   ├── next.config.ts     # Next.js configuration
│   │   ├── tsconfig.json      # TypeScript configuration
│   │   ├── .env*              # Environment variables
│   │   └── package.json       # Frontend dependencies
│   │
│   ├── server/                # Backend (Express.js + PostgreSQL)
│   │   ├── config/            # Database and app configuration
│   │   ├── database-scripts/  # Database setup and migration scripts
│   │   ├── middleware/        # Express middleware (auth, validation, etc.)
│   │   ├── routes/            # API route handlers
│   │   ├── utils/             # Utility functions
│   │   ├── index.js           # API entry point (Express app)
│   │   ├── .env*              # Server environment variables
│   │   ├── render.yaml        # Render deployment config
│   │   └── package.json       # Backend dependencies
│   │
│   ├── CLOUDINARY_INTEGRATION_GUIDE.md
│   ├── SYSTEM_ARCHITECTURE_DOCUMENTATION.txt
│   └── README.md
│
├── enterprise/                # 🏢 Enterprise platform (Next.js)
│   ├── src/                   # Enterprise app source code
│   │   ├── app/               # Next.js App Router pages
│   │   └── components/        # React components
│   ├── public/                # Static assets
│   ├── .next/                 # Next.js build output
│   ├── next.config.ts         # Next.js configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── tsconfig.json          # TypeScript configuration
│   └── package.json           # Dependencies
│
├── mainsite/                  # 🌐 Marketing/landing site for opengeek.in
│   ├── src/                   # Next.js source code
│   │   ├── app/               # Next.js App Router pages
│   │   ├── components/        # React components
│   │   ├── lib/               # Utility libraries
│   │   └── middleware.ts      # Next.js middleware
│   ├── public/                # Static assets (images, icons, etc.)
│   ├── next.config.ts         # Next.js configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── tsconfig.json          # TypeScript configuration
│   ├── vercel.json            # Vercel deployment config
│   └── package.json           # Dependencies
│
├── .vscode/                   # VS Code workspace settings
├── LICENSE
└── README.md                  # Project overview and setup guide
```

---

## ⚙️ Tech Stack

### 🎨 Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.x | React framework with SSR, SSG, and App Router |
| **TypeScript** | 5.x | Static typing for better code quality and developer experience |
| **Tailwind CSS** | 3.x | Utility-first CSS framework for rapid UI development |
| **Clerk** | Latest | Authentication and user management |
| **Axios** | Latest | HTTP client for API requests |
| **React Hook Form** | Latest | Form handling and validation |
| **Lucide React** | Latest | Beautiful, customizable icons |

### 🔧 Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express.js** | 4.x | Fast, unopinionated web framework |
| **PostgreSQL** | 16+ | Robust relational database |
| **Clerk Backend** | Latest | Server-side authentication |
| **Cloudinary** | Latest | Image and media management |
| **CORS** | Latest | Cross-origin resource sharing |
| **Helmet** | Latest | Security middleware |

### 🛠️ Development Tools
- **ESLint** - Code linting and quality checks
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality
- **VS Code** - Recommended IDE with workspace settings

---

## 🌐 Project Overview

| Folder              | Description | Status |
|---------------------|-------------|--------|
| `communitysite`     | **Main OpenGeek community platform** - Full-stack social platform with posts, projects, user profiles, and real-time interactions | ✅ **Active** |
| `mainsite`          | **Marketing/landing site** - Public-facing website for [www.opengeek.in](https://www.opengeek.in) with community info and onboarding | ✅ **Active** |
| `enterprise`        | **Enterprise platform** - Business-focused platform for organizations and enterprise users | 🚧 **In Development** |
| `admin`             | **Admin dashboard** - Management interface for community moderation, analytics, and platform administration | 🚧 **In Development** |

---

## 🚀 Quick Start

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download |
|-------------|---------|----------|
| **Node.js** | 18.0+ | [Download](https://nodejs.org/) |
| **npm** | 9.0+ | Comes with Node.js |
| **PostgreSQL** | 16.0+ | [Download](https://www.postgresql.org/download/) |
| **Git** | Latest | [Download](https://git-scm.com/) |

### 🔧 Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/AhqafCoder/OPENGEEK.git
cd OPENGEEK
```

#### 2. Set Up the Community Platform (Main App)

##### 🎨 Frontend Setup
```bash
cd communitysite/client
npm install
```

Create your environment file:
```bash
cp .env.example .env.local
```

Configure your `.env.local`:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

##### 🔧 Backend Setup
```bash
cd ../server
npm install
```

Create your environment file:
```bash
cp .env.example .env
```

Configure your `.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/opengeek_community

# Clerk Configuration
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

##### 🗄️ Database Setup
```bash
# Create PostgreSQL database
createdb opengeek_community

# Run database migrations (if available)
npm run migrate
```

#### 3. Start the Development Servers

##### Start Backend Server
```bash
cd communitysite/server
npm run dev
```

##### Start Frontend Server (in a new terminal)
```bash
cd communitysite/client
npm run dev
```

#### 4. Access the Applications

| Application | URL | Description |
|-------------|-----|-------------|
| **Community Platform** | http://localhost:3000 | Main social platform |
| **API Server** | http://localhost:5000 | Backend API |
| **Main Website** | http://localhost:3000 | Marketing site (separate setup) |

### 🌐 Running Other Applications

#### Main Website (Marketing Site)
```bash
cd mainsite
npm install
npm run dev
```

#### Enterprise Platform
```bash
cd enterprise
npm install
npm run dev
```

#### Admin Dashboard
```bash
# Frontend
cd admin/client
npm install
npm run dev

# Backend
cd admin/server
npm install
npm start
```

---

## ✨ Key Features

### 🏠 Community Platform Features
- **👤 User Profiles** - Customizable profiles with skills, projects, and achievements
- **📝 Social Posts** - Share updates, ask questions, and engage with the community
- **🚀 Project Showcase** - Display your projects with live demos and GitHub integration
- **💬 Real-time Chat** - Connect with fellow developers instantly
- **🏆 Achievement System** - Earn badges and recognition for contributions
- **� Rkesource Sharing** - Access curated learning materials and tutorials
- **🎯 Skill Tracking** - Monitor your learning progress and set goals
- **🔍 Smart Search** - Find projects, users, and resources easily

### 🌐 Marketing Site Features
- **📱 Responsive Design** - Perfect experience across all devices
- **⚡ Fast Loading** - Optimized for performance with Next.js
- **🎨 Modern UI** - Clean, professional design with smooth animations
- **� Analdytics Integration** - Track visitor engagement and conversions
- **🔍 SEO Optimized** - Built for search engine visibility

### 🏢 Enterprise Platform Features
- **👥 Team Management** - Organize and manage development teams
- **📈 Project Analytics** - Track project progress and team performance
- **🔐 Advanced Security** - Enterprise-grade security and compliance
- **🔗 API Integration** - Connect with existing enterprise tools
- **📊 Custom Dashboards** - Tailored insights for business needs

---

## � nDeployment

### 🌐 Frontend Deployment (Vercel - Recommended)

#### Community Platform
```bash
cd communitysite/client
npm run build
# Deploy to Vercel
vercel --prod
```

#### Main Website
```bash
cd mainsite
npm run build
# Deploy to Vercel
vercel --prod
```

### 🔧 Backend Deployment (Render/Railway)

#### Using Render
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy with automatic builds on push

#### Using Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### 🗄️ Database Deployment

#### PostgreSQL on Render
1. Create a PostgreSQL service on Render
2. Copy the connection string
3. Update your environment variables

#### Supabase (Alternative)
1. Create a project on [Supabase](https://supabase.com)
2. Get your connection string
3. Run migrations if needed

---

## 🛠️ Development Guidelines

### 📝 Code Style
- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Write **meaningful commit messages**
- Add **JSDoc comments** for functions
- Use **semantic HTML** and **accessible components**

### 🧪 Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### 🔍 Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

---

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Reset database
dropdb opengeek_community
createdb opengeek_community
```

#### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
```

#### Clerk Authentication Issues
1. Verify your Clerk keys in environment files
2. Check if you're using the correct environment (dev/prod)
3. Ensure your domain is added to Clerk dashboard

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 🆘 Getting Help

If you encounter issues:

1. **Check the [Issues](https://github.com/AhqafCoder/OPENGEEK/issues)** - Someone might have faced the same problem
2. **Join our [Discord](https://discord.gg/WsmZ6eupnk)** - Get real-time help from the community
3. **Create a new issue** - Provide detailed information about your problem

---

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Here's how you can contribute:

### 🚀 Quick Contribution Guide

1. **🍴 Fork the repository**
2. **🌿 Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **💻 Make your changes**
4. **✅ Test your changes**
   ```bash
   npm test
   npm run lint
   ```
5. **📝 Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **🚀 Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **🔄 Open a Pull Request**

### 🎯 Contribution Areas

| Area | Description | Good for |
|------|-------------|----------|
| **🐛 Bug Fixes** | Fix existing issues and bugs | Beginners |
| **✨ New Features** | Add new functionality | Intermediate |
| **📚 Documentation** | Improve docs and guides | All levels |
| **🎨 UI/UX** | Enhance user interface | Designers |
| **⚡ Performance** | Optimize code and performance | Advanced |
| **🧪 Testing** | Add tests and improve coverage | All levels |

### 📋 Contribution Guidelines

- **Follow the code style** - Use ESLint and Prettier
- **Write tests** - Add tests for new features
- **Update documentation** - Keep docs up to date
- **Be respectful** - Follow our code of conduct
- **Start small** - Begin with small contributions

---

## 🌟 Community & Support

### 💬 Join Our Community

- **🌐 Website**: [www.opengeek.in](https://www.opengeek.in)
- **💬 Discord**: [Join our Discord](https://discord.gg/WsmZ6eupnk) - Real-time chat and support
- **📱 Instagram**: [@opengeek.in](https://instagram.com/opengeek.in) - Updates and highlights
- **🐦 Twitter**: [@opengeek_in](https://twitter.com/opengeek_in) - News and announcements
- **📧 Email**: [hello@opengeek.in](mailto:hello@opengeek.in) - Direct contact

### 🎯 What We Offer

- **🚀 Real Projects** - Work on projects that matter
- **👥 Mentorship** - Learn from experienced developers
- **💼 Opportunities** - Access to internships and jobs
- **🏆 Recognition** - Get recognized for your contributions
- **📚 Learning** - Continuous skill development
- **🤝 Networking** - Connect with like-minded developers

### 🏆 Recognition

Contributors get:
- **🌟 GitHub profile recognition**
- **🏅 Community badges and achievements**
- **📜 Certificates for significant contributions**
- **💼 Job and internship referrals**
- **🎤 Speaking opportunities at events**

---

## 📊 Project Stats

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/AhqafCoder/OPENGEEK)
![GitHub language count](https://img.shields.io/github/languages/count/AhqafCoder/OPENGEEK)
![GitHub top language](https://img.shields.io/github/languages/top/AhqafCoder/OPENGEEK)
![GitHub last commit](https://img.shields.io/github/last-commit/AhqafCoder/OPENGEEK)
![GitHub issues](https://img.shields.io/github/issues/AhqafCoder/OPENGEEK)
![GitHub pull requests](https://img.shields.io/github/issues-pr/AhqafCoder/OPENGEEK)

</div>

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 🤝 What this means:
- ✅ **Commercial use** - Use in commercial projects
- ✅ **Modification** - Modify the code as needed
- ✅ **Distribution** - Share and distribute freely
- ✅ **Private use** - Use in private projects
- ❗ **Attribution required** - Credit the original authors

---

## 🙏 Acknowledgments

Special thanks to:

- **🎓 Student Community** - For continuous feedback and support
- **👨‍💻 Open Source Contributors** - For making this project better
- **🏢 Partner Organizations** - For providing opportunities
- **🛠️ Technology Partners** - Clerk, Vercel, Render, and others

---

<div align="center">

## 💝 Made with Love

**Built by students, for students** 🎓

*"We don't just code for placements, we code for purpose"* ✨

---

**⭐ Star this repo if you find it helpful!**

[🌟 Star on GitHub](https://github.com/AhqafCoder/OPENGEEK) • [🍴 Fork](https://github.com/AhqafCoder/OPENGEEK/fork) • [🐛 Report Bug](https://github.com/AhqafCoder/OPENGEEK/issues) • [💡 Request Feature](https://github.com/AhqafCoder/OPENGEEK/issues)

</div>

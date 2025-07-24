require('dotenv').config();
const { pool } = require('../config/database');

const seedData = {
  // Sample users (these would normally be created via Clerk webhooks)
  users: [
    {
      id: 'user_sample_1',
      email: 'john.doe@example.com',
      username: 'johndoe',
      first_name: 'John',
      last_name: 'Doe',
      full_name: 'John Doe',
      image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      bio: 'Full-stack developer passionate about React and Node.js',
      location: 'San Francisco, CA',
      github_username: 'johndoe',
      is_verified: true
    },
    {
      id: 'user_sample_2',
      email: 'sarah.wilson@example.com',
      username: 'sarahw',
      first_name: 'Sarah',
      last_name: 'Wilson',
      full_name: 'Sarah Wilson',
      image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      bio: 'AI/ML engineer and open source contributor',
      location: 'New York, NY',
      github_username: 'sarahw',
      is_verified: true
    },
    {
      id: 'user_sample_3',
      email: 'mike.chen@example.com',
      username: 'mikechen',
      first_name: 'Mike',
      last_name: 'Chen',
      full_name: 'Mike Chen',
      image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      bio: 'DevOps engineer and cloud architecture enthusiast',
      location: 'Seattle, WA',
      github_username: 'mikechen',
      is_verified: false
    }
  ],
  
  // Sample posts
  posts: [
    {
      user_id: 'user_sample_1',
      content: 'Just finished building my first React component library! 🎉 Check it out and let me know what you think. It includes 50+ components with full TypeScript support and accessibility features. #webdev #react #opensource',
      image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      likes_count: 42,
      comments_count: 8
    },
    {
      user_id: 'user_sample_2',
      content: 'Working on a new AI chat application using OpenAI API. The real-time features are coming together nicely! 🤖 Anyone else working with WebSockets and AI integration? #ai #machinelearning #webdev',
      image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      likes_count: 89,
      comments_count: 15
    },
    {
      user_id: 'user_sample_3',
      content: 'Finally mastered Docker containers! The deployment process is now so much smoother. Docker-compose makes multi-service apps a breeze 🐳 #docker #devops #containers',
      likes_count: 67,
      comments_count: 12
    },
    {
      user_id: 'user_sample_1',
      content: 'Learning TypeScript has been a game changer for my development workflow. The type safety and IntelliSense support make coding so much more enjoyable! 🔥 #typescript #javascript #webdev',
      likes_count: 56,
      comments_count: 9
    },
    {
      user_id: 'user_sample_2',
      content: 'Just open-sourced my CLI tool for managing environment variables across different projects. Hope it helps other developers! 🛠️ Check it out on GitHub. #opensource #cli #devtools',
      likes_count: 73,
      comments_count: 22
    }
  ],
  
  // Sample projects
  projects: [
    {
      user_id: 'user_sample_1',
      title: 'React Component Library',
      description: 'A comprehensive UI component library built with React, TypeScript, and Tailwind CSS. Features 50+ components with full accessibility support.',
      image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      github_url: 'https://github.com/johndoe/react-ui-lib',
      live_url: 'https://react-ui-lib.vercel.app',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'UI Library'],
      language: 'TypeScript',
      stars_count: 1247,
      forks_count: 89,
      is_featured: true,
      is_approved: true
    },
    {
      user_id: 'user_sample_2',
      title: 'AI Chat Application',
      description: 'Real-time chat application with AI integration using OpenAI API. Features include message history, user authentication, and responsive design.',
      image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      github_url: 'https://github.com/sarahw/ai-chat-app',
      live_url: 'https://ai-chat-demo.vercel.app',
      tags: ['Next.js', 'OpenAI', 'Socket.io', 'MongoDB'],
      language: 'JavaScript',
      stars_count: 892,
      forks_count: 156,
      is_featured: true,
      is_approved: true
    },
    {
      user_id: 'user_sample_3',
      title: 'DevOps Automation Tool',
      description: 'CLI tool for automating deployment pipelines with Docker, Kubernetes, and CI/CD integration.',
      image_url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop',
      github_url: 'https://github.com/mikechen/devops-cli',
      tags: ['Go', 'Docker', 'Kubernetes', 'CLI'],
      language: 'Go',
      stars_count: 789,
      forks_count: 123,
      is_featured: false,
      is_approved: true
    }
  ]
};

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    
    await client.query('BEGIN');
    
    // Clear existing data (in reverse order due to foreign keys)
    console.log('🧹 Clearing existing data...');
    await client.query('DELETE FROM comment_likes');
    await client.query('DELETE FROM post_comments');
    await client.query('DELETE FROM post_likes');
    await client.query('DELETE FROM project_stars');
    await client.query('DELETE FROM projects');
    await client.query('DELETE FROM posts');
    await client.query('DELETE FROM users');
    
    // Seed users
    console.log('👥 Seeding users...');
    for (const user of seedData.users) {
      await client.query(`
        INSERT INTO users (id, email, username, first_name, last_name, full_name, image_url, bio, location, github_username, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        user.id, user.email, user.username, user.first_name, user.last_name,
        user.full_name, user.image_url, user.bio, user.location, user.github_username, user.is_verified
      ]);
    }
    
    // Seed posts
    console.log('📝 Seeding posts...');
    for (const post of seedData.posts) {
      await client.query(`
        INSERT INTO posts (user_id, content, image_url, likes_count, comments_count)
        VALUES ($1, $2, $3, $4, $5)
      `, [post.user_id, post.content, post.image_url, post.likes_count, post.comments_count]);
    }
    
    // Seed projects
    console.log('🚀 Seeding projects...');
    for (const project of seedData.projects) {
      await client.query(`
        INSERT INTO projects (user_id, title, description, image_url, github_url, live_url, tags, language, stars_count, forks_count, is_featured, is_approved)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        project.user_id, project.title, project.description, project.image_url,
        project.github_url, project.live_url, project.tags, project.language,
        project.stars_count, project.forks_count, project.is_featured, project.is_approved
      ]);
    }
    
    // Create some sample likes and comments
    console.log('❤️  Seeding interactions...');
    
    // Get post IDs
    const postsResult = await client.query('SELECT id, user_id FROM posts ORDER BY created_at');
    const posts = postsResult.rows;
    
    // Add some likes
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const likers = seedData.users.filter(u => u.id !== post.user_id).slice(0, 2);
      
      for (const liker of likers) {
        await client.query(`
          INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)
          ON CONFLICT (post_id, user_id) DO NOTHING
        `, [post.id, liker.id]);
      }
    }
    
    // Add some comments
    if (posts.length > 0) {
      await client.query(`
        INSERT INTO post_comments (post_id, user_id, content)
        VALUES 
          ($1, $2, 'Great work! This looks amazing 🔥'),
          ($1, $3, 'Thanks for sharing this. Very helpful!'),
          ($4, $2, 'I''ve been looking for something like this. Awesome job!')
      `, [posts[0].id, 'user_sample_2', 'user_sample_3', posts[1]?.id || posts[0].id]);
    }
    
    await client.query('COMMIT');
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Seeded: ${seedData.users.length} users, ${seedData.posts.length} posts, ${seedData.projects.length} projects`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
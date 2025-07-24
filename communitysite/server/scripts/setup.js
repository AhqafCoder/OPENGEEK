require('dotenv').config();
const { testConnection } = require('../config/database');
const { runMigrations } = require('./migrate');
const { seedDatabase } = require('./seed');

async function setupDatabase() {
  console.log('🚀 Starting OPENGEEK Community database setup...\n');
  
  try {
    // Test database connection
    console.log('1️⃣  Testing database connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      throw new Error('Database connection failed. Please check your configuration.');
    }
    
    console.log('✅ Database connection successful!\n');
    
    // Run migrations
    console.log('2️⃣  Running database migrations...');
    await runMigrations();
    console.log('✅ Migrations completed!\n');
    
    // Ask user if they want to seed the database
    const shouldSeed = process.argv.includes('--seed') || process.argv.includes('-s');
    
    if (shouldSeed) {
      console.log('3️⃣  Seeding database with sample data...');
      await seedDatabase();
      console.log('✅ Database seeded successfully!\n');
    } else {
      console.log('3️⃣  Skipping database seeding (use --seed flag to include sample data)\n');
    }
    
    console.log('🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Copy .env.example to .env and configure your environment variables');
    console.log('   2. Set up your Clerk authentication keys');
    console.log('   3. Configure Cloudinary for image uploads (optional)');
    console.log('   4. Run "npm run dev" to start the development server');
    console.log('\n🔗 Useful commands:');
    console.log('   npm run dev        - Start development server');
    console.log('   npm run migrate    - Run database migrations');
    console.log('   npm run seed       - Seed database with sample data');
    console.log('   npm run db:reset   - Reset database (migrate + seed)');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Make sure PostgreSQL is running');
    console.error('   2. Check your database credentials in .env file');
    console.error('   3. Ensure the database exists and is accessible');
    console.error('   4. Verify your DATABASE_URL format if using connection string');
    
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET /dashboard/stats → Returns dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total users count
    const usersResult = await db.query('SELECT COUNT(*) as total_users FROM users');
    const totalUsers = parseInt(usersResult.rows[0].total_users);

    // Get total content count
    const contentResult = await db.query('SELECT COUNT(*) as total_content FROM content');
    const totalContent = parseInt(contentResult.rows[0].total_content);

    // Get active users count (users with recent activity)
    // This is a simplified example - in a real implementation, you would have a more complex query
    const activeUsersResult = await db.query('SELECT COUNT(*) as active_users FROM users WHERE created_at >= NOW() - INTERVAL \'30 days\'');
    const activeUsers = parseInt(activeUsersResult.rows[0].active_users);

    // Get new signups this month
    const newSignupsResult = await db.query('SELECT COUNT(*) as new_signups FROM users WHERE created_at >= DATE_TRUNC(\'month\', NOW())');
    const newSignups = parseInt(newSignupsResult.rows[0].new_signups);

    res.json({
      success: true,
      data: {
        total_users: totalUsers,
        total_content: totalContent,
        active_users: activeUsers,
        new_signups_this_month: newSignups
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET /users → List all users
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, email, role, created_at FROM users');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// GET /users/:id → Get user details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT id, username, email, role, created_at FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// POST /users → Add user
router.post('/', async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const result = await db.query(
      'INSERT INTO users (username, email, role) VALUES ($1, $2, $3) RETURNING id, username, email, role, created_at',
      [username, email, role]
    );
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
});

// PUT /users/:id → Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;
    
    const result = await db.query(
      'UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, username, email, role, created_at',
      [username, email, role, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
});

// DELETE /users/:id → Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

module.exports = router;

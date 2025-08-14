const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET /content → List all content
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, title, description, created_at, updated_at FROM content');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching content',
      error: error.message
    });
  }
});

// POST /content → Add new content
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const result = await db.query(
      'INSERT INTO content (title, description) VALUES ($1, $2) RETURNING id, title, description, created_at, updated_at',
      [title, description]
    );
    
    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating content',
      error: error.message
    });
  }
});

// PUT /content/:id → Update content
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    const result = await db.query(
      'UPDATE content SET title = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING id, title, description, created_at, updated_at',
      [title, description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Content updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating content',
      error: error.message
    });
  }
});

// DELETE /content/:id → Delete content
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM content WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting content',
      error: error.message
    });
  }
});

module.exports = router;

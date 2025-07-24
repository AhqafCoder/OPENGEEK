const express = require('express');
const { body, validationResult, param, query } = require('express-validator');
const { pool } = require('../config/database');
const { requireAuth, optionalAuth, getUserInfo } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Validation middleware
const validatePost = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content must be between 1 and 2000 characters'),
];

const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Helper function to get post with user info and interaction counts
const getPostWithDetails = async (postId, currentUserId = null) => {
  const query = `
    SELECT 
      p.*,
      u.username,
      u.full_name,
      u.image_url as user_image_url,
      u.is_verified,
      ${currentUserId ? `
        EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = $2) as is_liked_by_user
      ` : 'FALSE as is_liked_by_user'}
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = $1 AND p.is_archived = FALSE
  `;
  
  const params = currentUserId ? [postId, currentUserId] : [postId];
  const result = await pool.query(query, params);
  
  return result.rows[0];
};

// GET /api/posts - Get all posts with pagination
router.get('/', optionalAuth, getUserInfo, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50); // Max 50 posts per page
    const offset = (page - 1) * limit;
    const sortBy = req.query.sort || 'created_at'; // created_at, likes_count
    const order = req.query.order === 'asc' ? 'ASC' : 'DESC';
    
    // Validate sort field
    const allowedSortFields = ['created_at', 'likes_count', 'comments_count'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    
    const query = `
      SELECT 
        p.*,
        u.username,
        u.full_name,
        u.image_url as user_image_url,
        u.is_verified,
        ${req.userId ? `
          EXISTS(SELECT 1 FROM post_likes pl WHERE pl.post_id = p.id AND pl.user_id = $4) as is_liked_by_user
        ` : 'FALSE as is_liked_by_user'}
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_archived = FALSE
      ORDER BY p.is_pinned DESC, p.${sortField} ${order}
      LIMIT $1 OFFSET $2
    `;
    
    const countQuery = `
      SELECT COUNT(*) as total
      FROM posts p
      WHERE p.is_archived = FALSE
    `;
    
    const params = req.userId ? [limit, offset, req.userId] : [limit, offset];
    
    const [postsResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery)
    ]);
    
    const posts = postsResult.rows;
    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
    });
  }
});

// GET /api/posts/:id - Get single post
router.get('/:id', 
  param('id').isUUID().withMessage('Invalid post ID'),
  handleValidationErrors,
  optionalAuth,
  getUserInfo,
  async (req, res) => {
    try {
      const post = await getPostWithDetails(req.params.id, req.userId);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      res.json({
        success: true,
        data: { post }
      });
    } catch (error) {
      console.error('Get post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch post'
      });
    }
  }
);

// POST /api/posts - Create new post
router.post('/',
  requireAuth,
  getUserInfo,
  upload.single('image'),
  validatePost,
  handleValidationErrors,
  async (req, res) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { content } = req.body;
      let imageUrl = null;
      let imagePublicId = null;
      
      // Handle image upload
      if (req.file) {
        imageUrl = req.file.secure_url;
        imagePublicId = req.file.public_id;
      }
      
      // Ensure user exists in our database
      const userUpsertQuery = `
        INSERT INTO users (id, email, username, first_name, last_name, full_name, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          username = EXCLUDED.username,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          full_name = EXCLUDED.full_name,
          image_url = EXCLUDED.image_url,
          updated_at = CURRENT_TIMESTAMP
      `;
      
      await client.query(userUpsertQuery, [
        req.userId,
        req.user.email,
        req.user.username,
        req.user.firstName,
        req.user.lastName,
        req.user.fullName,
        req.user.imageUrl
      ]);
      
      // Create post
      const postQuery = `
        INSERT INTO posts (user_id, content, image_url, image_public_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `;
      
      const postResult = await client.query(postQuery, [
        req.userId,
        content,
        imageUrl,
        imagePublicId
      ]);
      
      await client.query('COMMIT');
      
      // Fetch the created post with user details
      const newPost = await getPostWithDetails(postResult.rows[0].id, req.userId);
      
      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: { post: newPost }
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Create post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create post'
      });
    } finally {
      client.release();
    }
  }
);

// PUT /api/posts/:id - Update post
router.put('/:id',
  param('id').isUUID().withMessage('Invalid post ID'),
  requireAuth,
  getUserInfo,
  validatePost,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { content } = req.body;
      
      // Check if post exists and user owns it
      const checkQuery = `
        SELECT user_id FROM posts WHERE id = $1 AND is_archived = FALSE
      `;
      const checkResult = await pool.query(checkQuery, [req.params.id]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      if (checkResult.rows[0].user_id !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'You can only edit your own posts'
        });
      }
      
      // Update post
      const updateQuery = `
        UPDATE posts 
        SET content = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `;
      
      await pool.query(updateQuery, [content, req.params.id]);
      
      // Fetch updated post
      const updatedPost = await getPostWithDetails(req.params.id, req.userId);
      
      res.json({
        success: true,
        message: 'Post updated successfully',
        data: { post: updatedPost }
      });
    } catch (error) {
      console.error('Update post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update post'
      });
    }
  }
);

// DELETE /api/posts/:id - Delete post
router.delete('/:id',
  param('id').isUUID().withMessage('Invalid post ID'),
  requireAuth,
  handleValidationErrors,
  async (req, res) => {
    try {
      // Check if post exists and user owns it
      const checkQuery = `
        SELECT user_id, image_public_id FROM posts WHERE id = $1 AND is_archived = FALSE
      `;
      const checkResult = await pool.query(checkQuery, [req.params.id]);
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      if (checkResult.rows[0].user_id !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete your own posts'
        });
      }
      
      // Soft delete (archive) the post
      const deleteQuery = `
        UPDATE posts 
        SET is_archived = TRUE, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `;
      
      await pool.query(deleteQuery, [req.params.id]);
      
      // TODO: Delete image from Cloudinary if exists
      // if (checkResult.rows[0].image_public_id) {
      //   await cloudinary.uploader.destroy(checkResult.rows[0].image_public_id);
      // }
      
      res.json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      console.error('Delete post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete post'
      });
    }
  }
);

// POST /api/posts/:id/like - Like/unlike post
router.post('/:id/like',
  param('id').isUUID().withMessage('Invalid post ID'),
  requireAuth,
  handleValidationErrors,
  async (req, res) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if post exists
      const postCheck = await client.query(
        'SELECT id FROM posts WHERE id = $1 AND is_archived = FALSE',
        [req.params.id]
      );
      
      if (postCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      // Check if already liked
      const likeCheck = await client.query(
        'SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2',
        [req.params.id, req.userId]
      );
      
      let isLiked;
      
      if (likeCheck.rows.length > 0) {
        // Unlike
        await client.query(
          'DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2',
          [req.params.id, req.userId]
        );
        
        await client.query(
          'UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1',
          [req.params.id]
        );
        
        isLiked = false;
      } else {
        // Like
        await client.query(
          'INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)',
          [req.params.id, req.userId]
        );
        
        await client.query(
          'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1',
          [req.params.id]
        );
        
        isLiked = true;
      }
      
      // Get updated likes count
      const countResult = await client.query(
        'SELECT likes_count FROM posts WHERE id = $1',
        [req.params.id]
      );
      
      await client.query('COMMIT');
      
      res.json({
        success: true,
        message: isLiked ? 'Post liked' : 'Post unliked',
        data: {
          isLiked,
          likesCount: countResult.rows[0].likes_count
        }
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Like post error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to like/unlike post'
      });
    } finally {
      client.release();
    }
  }
);

// GET /api/posts/:id/comments - Get post comments
router.get('/:id/comments',
  param('id').isUUID().withMessage('Invalid post ID'),
  handleValidationErrors,
  optionalAuth,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 20, 50);
      const offset = (page - 1) * limit;
      
      const query = `
        SELECT 
          c.*,
          u.username,
          u.full_name,
          u.image_url as user_image_url,
          u.is_verified,
          ${req.userId ? `
            EXISTS(SELECT 1 FROM comment_likes cl WHERE cl.comment_id = c.id AND cl.user_id = $4) as is_liked_by_user
          ` : 'FALSE as is_liked_by_user'}
        FROM post_comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = $1 AND c.parent_id IS NULL
        ORDER BY c.created_at ASC
        LIMIT $2 OFFSET $3
      `;
      
      const params = req.userId ? [req.params.id, limit, offset, req.userId] : [req.params.id, limit, offset];
      const result = await pool.query(query, params);
      
      res.json({
        success: true,
        data: { comments: result.rows }
      });
    } catch (error) {
      console.error('Get comments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch comments'
      });
    }
  }
);

// POST /api/posts/:id/comments - Add comment to post
router.post('/:id/comments',
  param('id').isUUID().withMessage('Invalid post ID'),
  requireAuth,
  getUserInfo,
  validateComment,
  handleValidationErrors,
  async (req, res) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const { content, parentId } = req.body;
      
      // Check if post exists
      const postCheck = await client.query(
        'SELECT id FROM posts WHERE id = $1 AND is_archived = FALSE',
        [req.params.id]
      );
      
      if (postCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      // Ensure user exists in our database
      const userUpsertQuery = `
        INSERT INTO users (id, email, username, first_name, last_name, full_name, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          username = EXCLUDED.username,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          full_name = EXCLUDED.full_name,
          image_url = EXCLUDED.image_url,
          updated_at = CURRENT_TIMESTAMP
      `;
      
      await client.query(userUpsertQuery, [
        req.userId,
        req.user.email,
        req.user.username,
        req.user.firstName,
        req.user.lastName,
        req.user.fullName,
        req.user.imageUrl
      ]);
      
      // Create comment
      const commentQuery = `
        INSERT INTO post_comments (post_id, user_id, content, parent_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `;
      
      const commentResult = await client.query(commentQuery, [
        req.params.id,
        req.userId,
        content,
        parentId || null
      ]);
      
      // Update post comments count
      await client.query(
        'UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1',
        [req.params.id]
      );
      
      await client.query('COMMIT');
      
      // Fetch the created comment with user details
      const newCommentQuery = `
        SELECT 
          c.*,
          u.username,
          u.full_name,
          u.image_url as user_image_url,
          u.is_verified,
          FALSE as is_liked_by_user
        FROM post_comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = $1
      `;
      
      const newCommentResult = await client.query(newCommentQuery, [commentResult.rows[0].id]);
      
      res.status(201).json({
        success: true,
        message: 'Comment added successfully',
        data: { comment: newCommentResult.rows[0] }
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Add comment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add comment'
      });
    } finally {
      client.release();
    }
  }
);

module.exports = router;
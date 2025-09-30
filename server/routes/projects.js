const express = require('express');
const { Project, User } = require('../models');
const { 
  authenticateToken, 
  authorizeRoles, 
  authorizeProjectAccess, 
  authorizeProjectPermission 
} = require('../middleware/auth');
const { 
  validateProjectCreation, 
  validateProjectUpdate, 
  validateProjectId, 
  validatePagination 
} = require('../utils/validation');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects for user
// @access  Private
router.get('/', authenticateToken, validatePagination, async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', status, search } = req.query;
    const userId = req.user._id;

    // Build query
    const query = {
      $or: [
        { owner: userId },
        { 'members.user': userId }
      ]
    };

    // Add status filter
    if (status) {
      query.status = status;
    }

    // Add search filter
    if (search) {
      query.$and = [
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get projects with pagination
    const projects = await Project.find(query)
      .populate('owner', 'firstName lastName email')
      .populate('members.user', 'firstName lastName email')
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
});

// @route   GET /api/projects/:projectId
// @desc    Get single project
// @access  Private
router.get('/:projectId', authenticateToken, validateProjectId, authorizeProjectAccess, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('owner', 'firstName lastName email')
      .populate('members.user', 'firstName lastName email');

    res.json({
      success: true,
      data: { project }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: error.message
    });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', authenticateToken, validateProjectCreation, async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      owner: req.user._id
    };

    const project = new Project(projectData);
    await project.save();

    // Populate the created project
    await project.populate('owner', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
});

// @route   PUT /api/projects/:projectId
// @desc    Update project
// @access  Private
router.put('/:projectId', authenticateToken, validateProjectId, authorizeProjectAccess, async (req, res) => {
  try {
    const { projectId } = req.params;
    const updateData = req.body;

    // Check if user is owner or has admin role
    if (req.userRole !== 'owner' && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only project owner or admin can update project'
      });
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName email')
     .populate('members.user', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: { project }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
});

// @route   DELETE /api/projects/:projectId
// @desc    Delete project
// @access  Private
router.delete('/:projectId', authenticateToken, validateProjectId, authorizeProjectAccess, async (req, res) => {
  try {
    // Only owner can delete project
    if (req.userRole !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can delete project'
      });
    }

    await Project.findByIdAndDelete(req.params.projectId);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
});

// @route   POST /api/projects/:projectId/members
// @desc    Add member to project
// @access  Private
router.post('/:projectId/members', authenticateToken, validateProjectId, authorizeProjectAccess, async (req, res) => {
  try {
    const { userId, role = 'tester', permissions = {} } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add member to project
    await req.project.addMember(userId, role, permissions);

    // Fetch updated project
    const updatedProject = await Project.findById(req.params.projectId)
      .populate('owner', 'firstName lastName email')
      .populate('members.user', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Member added successfully',
      data: { project: updatedProject }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add member',
      error: error.message
    });
  }
});

// @route   DELETE /api/projects/:projectId/members/:userId
// @desc    Remove member from project
// @access  Private
router.delete('/:projectId/members/:userId', authenticateToken, validateProjectId, authorizeProjectAccess, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is owner or admin
    if (req.userRole !== 'owner' && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only project owner or admin can remove members'
      });
    }

    // Cannot remove project owner
    if (req.project.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove project owner'
      });
    }

    await req.project.removeMember(userId);

    // Fetch updated project
    const updatedProject = await Project.findById(req.params.projectId)
      .populate('owner', 'firstName lastName email')
      .populate('members.user', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Member removed successfully',
      data: { project: updatedProject }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove member',
      error: error.message
    });
  }
});

// @route   PUT /api/projects/:projectId/members/:userId/role
// @desc    Update member role
// @access  Private
router.put('/:projectId/members/:userId/role', authenticateToken, validateProjectId, authorizeProjectAccess, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      });
    }

    // Check if user is owner or admin
    if (req.userRole !== 'owner' && req.userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only project owner or admin can update member roles'
      });
    }

    await req.project.updateMemberRole(userId, role);

    // Fetch updated project
    const updatedProject = await Project.findById(req.params.projectId)
      .populate('owner', 'firstName lastName email')
      .populate('members.user', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Member role updated successfully',
      data: { project: updatedProject }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update member role',
      error: error.message
    });
  }
});

module.exports = router;

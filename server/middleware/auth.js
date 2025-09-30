const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

const authorizeProjectAccess = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    // Import Project model here to avoid circular dependency
    const { Project } = require('../models');
    
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner or member
    const isOwner = project.owner.toString() === userId.toString();
    const isMember = project.members.some(member => 
      member.user.toString() === userId.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - not a member of this project'
      });
    }

    req.project = project;
    req.userRole = isOwner ? 'owner' : project.getUserRole(userId);
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization error',
      error: error.message
    });
  }
};

const authorizeProjectPermission = (permission) => {
  return (req, res, next) => {
    if (!req.project || !req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Owner has all permissions
    if (req.userRole === 'owner') {
      return next();
    }

    // Check specific permission
    if (!req.project.hasPermission(req.user._id, permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission denied - ${permission} required`
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  authorizeProjectAccess,
  authorizeProjectPermission
};

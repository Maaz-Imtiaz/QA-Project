const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived', 'planning'],
    default: 'planning'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project owner is required']
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'tester', 'viewer'],
      default: 'tester'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    permissions: {
      canCreateTestCases: {
        type: Boolean,
        default: true
      },
      canExecuteTests: {
        type: Boolean,
        default: true
      },
      canManageMembers: {
        type: Boolean,
        default: false
      },
      canViewReports: {
        type: Boolean,
        default: true
      }
    }
  }],
  settings: {
    testCaseTemplate: {
      type: String,
      default: 'standard'
    },
    defaultPriority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    autoAssign: {
      type: Boolean,
      default: false
    },
    notifications: {
      onTestFailure: {
        type: Boolean,
        default: true
      },
      onTestCompletion: {
        type: Boolean,
        default: true
      },
      onMemberJoin: {
        type: Boolean,
        default: true
      }
    }
  },
  statistics: {
    totalTestCases: {
      type: Number,
      default: 0
    },
    totalTestSuites: {
      type: Number,
      default: 0
    },
    totalTestRuns: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  archivedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for member count
projectSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Virtual for active member count
projectSchema.virtual('activeMemberCount').get(function() {
  return this.members.filter(member => member.user).length;
});

// Index for better query performance
projectSchema.index({ owner: 1, status: 1 });
projectSchema.index({ 'members.user': 1 });
projectSchema.index({ name: 'text', description: 'text' });

// Pre-save middleware to update statistics
projectSchema.pre('save', function(next) {
  this.statistics.lastActivity = new Date();
  next();
});

// Method to add member to project
projectSchema.methods.addMember = function(userId, role = 'tester', permissions = {}) {
  const existingMember = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    throw new Error('User is already a member of this project');
  }
  
  this.members.push({
    user: userId,
    role,
    permissions: {
      canCreateTestCases: permissions.canCreateTestCases ?? true,
      canExecuteTests: permissions.canExecuteTests ?? true,
      canManageMembers: permissions.canManageMembers ?? false,
      canViewReports: permissions.canViewReports ?? true
    }
  });
  
  return this.save();
};

// Method to remove member from project
projectSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => 
    member.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to update member role
projectSchema.methods.updateMemberRole = function(userId, newRole) {
  const member = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (!member) {
    throw new Error('User is not a member of this project');
  }
  
  member.role = newRole;
  return this.save();
};

// Method to check if user has permission
projectSchema.methods.hasPermission = function(userId, permission) {
  const member = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (!member) return false;
  
  return member.permissions[permission] || false;
};

// Method to get user role in project
projectSchema.methods.getUserRole = function(userId) {
  const member = this.members.find(member => 
    member.user.toString() === userId.toString()
  );
  
  return member ? member.role : null;
};

module.exports = mongoose.model('Project', projectSchema);

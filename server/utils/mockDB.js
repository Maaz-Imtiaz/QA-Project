// Simple in-memory database for testing
const users = [
  {
    _id: '1',
    firstName: 'Maaz',
    lastName: 'Ahmed',
    email: 'maaz@geeksofkolachi.com',
    password: '$2b$10$example', // This would be hashed in real implementation
    isActive: true,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const resetTokens = new Map();

// Mock User model methods
const mockUser = {
  findOne: async (query) => {
    const user = users.find(u => {
      if (query.email) return u.email === query.email;
      if (query._id) return u._id === query._id;
      return false;
    });
    return user ? { ...user, save: () => Promise.resolve(user) } : null;
  },
  
  create: async (userData) => {
    const newUser = {
      _id: String(users.length + 1),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(newUser);
    return newUser;
  }
};

// Mock password reset methods
const mockPasswordReset = {
  generatePasswordResetToken: function() {
    const resetToken = Math.random().toString(36).substring(2, 15);
    const hashedToken = require('crypto').createHash('sha256').update(resetToken).digest('hex');
    
    this.resetPasswordToken = hashedToken;
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    return resetToken;
  },
  
  isResetTokenValid: function(token) {
    const hashedToken = require('crypto').createHash('sha256').update(token).digest('hex');
    return this.resetPasswordToken === hashedToken && 
           this.resetPasswordExpires > Date.now();
  },
  
  comparePassword: async function(password) {
    // For testing, accept any password
    return true;
  },
  
  generateAuthToken: function() {
    return 'mock-jwt-token-' + this._id;
  },
  
  updateLastLogin: async function() {
    this.lastLogin = new Date();
    return this;
  }
};

module.exports = {
  mockUser,
  mockPasswordReset,
  users,
  resetTokens
};

# Phase 1 Database Schemas - QA Test Case Management System

## 📋 **Overview**

This document outlines the database schemas and API endpoints for Phase 1 of the QA Test Case Management System, focusing on **Authentication** and **Project Management**.

## 🗄️ **Database Schemas**

### **1. User Schema (`/server/models/user.js`)**

**Purpose**: Store user authentication and profile information

**Fields**:
- `firstName` (String, required): User's first name
- `lastName` (String, required): User's last name  
- `email` (String, required, unique): User's email address
- `password` (String, required): Hashed password
- `role` (Enum): User role (admin, manager, tester, viewer)
- `isActive` (Boolean): Account status
- `lastLogin` (Date): Last login timestamp
- `avatar` (String): Profile picture URL
- `preferences` (Object): User preferences (theme, notifications)

**Methods**:
- `comparePassword()`: Verify password
- `generateAuthToken()`: Create JWT token
- `updateLastLogin()`: Update login timestamp

### **2. Project Schema (`/server/models/project.js`)**

**Purpose**: Store project information and member management

**Fields**:
- `name` (String, required): Project name
- `description` (String): Project description
- `status` (Enum): Project status (active, inactive, archived, planning)
- `owner` (ObjectId, ref: User): Project owner
- `members` (Array): Project members with roles and permissions
- `settings` (Object): Project-specific settings
- `statistics` (Object): Project metrics
- `tags` (Array): Project tags
- `isPublic` (Boolean): Public/private project

**Methods**:
- `addMember()`: Add user to project
- `removeMember()`: Remove user from project
- `updateMemberRole()`: Change member role
- `hasPermission()`: Check user permissions
- `getUserRole()`: Get user's role in project

## 🔐 **Authentication System**

### **JWT Token Structure**
```json
{
  "userId": "ObjectId",
  "email": "user@example.com", 
  "role": "tester",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### **Password Requirements**
- Minimum 6 characters
- Must contain: lowercase, uppercase, number
- Automatically hashed with bcrypt

## 🛡️ **Authorization Levels**

### **User Roles**
1. **Admin**: Full system access
2. **Manager**: Project management + team oversight
3. **Tester**: Create/execute test cases
4. **Viewer**: Read-only access

### **Project Permissions**
- `canCreateTestCases`: Create test cases
- `canExecuteTests`: Run test executions
- `canManageMembers`: Add/remove members
- `canViewReports`: Access analytics

## 🚀 **API Endpoints**

### **Authentication Routes (`/api/auth`)**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user | Private |
| POST | `/refresh` | Refresh JWT token | Private |
| POST | `/logout` | Logout user | Private |

### **Project Routes (`/api/projects`)**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get user's projects | Private |
| GET | `/:projectId` | Get single project | Private |
| POST | `/` | Create new project | Private |
| PUT | `/:projectId` | Update project | Private |
| DELETE | `/:projectId` | Delete project | Private |
| POST | `/:projectId/members` | Add member | Private |
| DELETE | `/:projectId/members/:userId` | Remove member | Private |
| PUT | `/:projectId/members/:userId/role` | Update member role | Private |

## 📊 **Database Relationships**

```
User (1) ──→ (∞) Project (as owner)
User (∞) ──→ (∞) Project (as member)
```

## 🔧 **Middleware**

### **Authentication Middleware**
- `authenticateToken`: Verify JWT token
- `authorizeRoles`: Check user role
- `authorizeProjectAccess`: Verify project membership
- `authorizeProjectPermission`: Check specific permissions

### **Validation Middleware**
- `validateUserRegistration`: User registration validation
- `validateUserLogin`: Login validation
- `validateProjectCreation`: Project creation validation
- `validateProjectUpdate`: Project update validation

## 🚀 **Getting Started**

### **1. Install Dependencies**
```bash
cd server
npm install
```

### **2. Environment Variables**
```bash
PORT=5001
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

### **3. Start Server**
```bash
npm run dev
```

## 📝 **Example API Calls**

### **Register User**
```bash
POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "password": "Password123"
}
```

### **Create Project**
```bash
POST /api/projects
Authorization: Bearer <token>
{
  "name": "E-commerce Testing",
  "description": "Testing e-commerce platform",
  "tags": ["web", "ecommerce"]
}
```

### **Add Project Member**
```bash
POST /api/projects/:projectId/members
Authorization: Bearer <token>
{
  "userId": "user_id_here",
  "role": "tester",
  "permissions": {
    "canCreateTestCases": true,
    "canExecuteTests": true
  }
}
```

## ✅ **Phase 1 Complete Features**

- ✅ User registration and authentication
- ✅ JWT token management
- ✅ Project CRUD operations
- ✅ Project member management
- ✅ Role-based access control
- ✅ Input validation and error handling
- ✅ Database relationships and indexes

## 🎯 **Next Steps (Phase 2)**

- Test Suite Management
- Test Case CRUD Operations  
- Test Execution Tracking
- Reporting and Analytics

# Quick MongoDB Atlas Setup

## 🚀 Create New Atlas Cluster (5 minutes)

### Step 1: Sign Up
1. Go to https://cloud.mongodb.com/
2. Click "Try Free" 
3. Sign up with Google/GitHub or email

### Step 2: Create Cluster
1. Choose "M0 Sandbox" (Free tier)
2. Select a region close to you
3. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access" 
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username/password (remember these!)
5. Set privileges to "Read and write to any database"

### Step 4: Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Confirm

### Step 5: Get Connection String
1. Go to "Clusters" 
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

### Step 6: Test Connection
The connection string should look like:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 📋 What I Need From You

Please provide me with your Atlas connection string, and I'll update your .env file automatically!

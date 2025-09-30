# MongoDB Atlas Setup Guide

## 🔧 How to Configure MongoDB Atlas Connection

### Step 1: Get Your Atlas Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in to your account
3. Click on "Connect" for your cluster
4. Choose "Connect your application"
5. Copy the connection string

### Step 2: Update Your Environment File

Edit `/Users/mac/Desktop/QA-Project/server/.env` and replace the MONGO_URI:

```bash
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/qa-tcms?retryWrites=true&w=majority
```

### Step 3: Replace the Placeholders

- `<username>` - Your MongoDB Atlas username
- `<password>` - Your MongoDB Atlas password
- `<cluster-url>` - Your cluster URL (e.g., cluster0.xxxxx.mongodb.net)

### Example:
```bash
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/qa-tcms?retryWrites=true&w=majority
```

### Step 4: Network Access

Make sure your IP address is whitelisted in Atlas:
1. Go to "Network Access" in Atlas
2. Add your current IP address
3. Or add `0.0.0.0/0` for development (not recommended for production)

### Step 5: Database User

Ensure you have a database user created:
1. Go to "Database Access" in Atlas
2. Create a user with read/write permissions
3. Use these credentials in your connection string

## 🚀 Testing the Connection

After updating the .env file, restart your server:

```bash
cd server
npm run dev
```

You should see:
```
MongoDB Atlas Connected: cluster0.xxxxx.mongodb.net
Database: qa-tcms
```

## 🔒 Security Notes

- Never commit your .env file to version control
- Use environment variables in production
- Consider using MongoDB Atlas connection pooling for production

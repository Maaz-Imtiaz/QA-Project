# QA Test Case Management System (QA-TCMS)

A comprehensive monorepo application for managing QA test cases, built with React frontend, Node.js backend, and MongoDB database.

## Project Structure

```
qa-tcms/
├── client/     # React frontend
├── server/     # Node.js backend
├── .gitignore
├── package.json
└── README.md
```

## Tech Stack

### Frontend
- React
- JavaScript/TypeScript
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

### Database
- MongoDB

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for all packages:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the server directory
   - Update MongoDB connection string

### Development

To run both frontend and backend in development mode:
```bash
npm run dev
```

Or run them separately:

**Backend (Server):**
```bash
npm run server
# or
cd server && npm run dev
```

**Frontend (Client):**
```bash
npm run client
# or
cd client && npm start
```

### API Endpoints

- `GET /` - Health check endpoint

## Project Status

🚧 **In Development** - Basic structure setup complete. Ready for feature development.

## Next Steps

- [ ] Authentication system
- [ ] Project management
- [ ] Test suite management
- [ ] Test case CRUD operations
- [ ] Test execution tracking
- [ ] Reporting and analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

# LaTeX Editor Backend

A Node.js/Express backend for the LaTeX Rich Text Editor application.

## Features

- RESTful API for CRUD operations on notes
- MongoDB integration with Mongoose
- Search functionality
- Pagination support
- Input validation and error handling
- Security middleware (Helmet, CORS)
- Environment-based configuration

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: Server port (default: 3001)
   - `FRONTEND_URL`: Frontend URL for CORS

4. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

5. Run the server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Notes

- `GET /api/notes` - Get all notes (with pagination and search)
- `GET /api/notes/:id` - Get a specific note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `GET /api/notes/search/:query` - Search notes

### Health Check

- `GET /api/health` - Server health check

## Request/Response Examples

### Create Note
```bash
POST /api/notes
Content-Type: application/json

{
  "title": "My LaTeX Note",
  "content": "This is a note with $E = mc^2$ inline math."
}
```

### Get Notes with Pagination
```bash
GET /api/notes?page=1&limit=10&search=math&sortBy=updatedAt&sortOrder=desc
```

## Database Schema

### Note Model
```javascript
{
  title: String (required, max 200 chars),
  content: String (required, max 50000 chars),
  tags: [String],
  isPublic: Boolean (default: false),
  userId: String (default: 'anonymous'),
  createdAt: Date,
  updatedAt: Date
}
```

## Production Deployment

### Environment Variables
Set these in your production environment:
- `NODE_ENV=production`
- `MONGODB_URI=<your-production-mongodb-uri>`
- `PORT=<your-port>`
- `FRONTEND_URL=<your-frontend-url>`

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your environment

## Security Features

- Helmet for security headers
- CORS configuration
- Input validation
- Error handling
- Request size limits

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── config/          # Configuration files
├── server.js        # Main server file
└── package.json     # Dependencies
```
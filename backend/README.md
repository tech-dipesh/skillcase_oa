# Skillcase Backend - Short Video Platform

## Tech Stack
- Node.js + Express (ES6 modules)
- PostgreSQL
- JWT authentication
- Multer for video uploads

## Setup

1. Clone repository
2. Create PostgreSQL database
3. Run `schema.sql` to create tables
4. Copy `.env.example` to `.env` and fill credentials
5. Run `npm install`
6. Run `npm run dev` for development

## API Endpoints

### Auth
- `POST /auth/register` - name, email, password
- `POST /auth/login` - email, password
- `GET /auth/me` - (protected)

### Videos
- `POST /videos` - (protected, multipart with field "video", body: title, description, category)
- `GET /videos` - all videos ordered by created_at DESC
- `GET /videos/:id` - single video

### Interactions
- `POST /videos/:id/like` - toggle like (protected)
- `POST /videos/:id/comment` - add comment (protected, body: content)
- `GET /videos/:id/comments` - get all comments for video
- `POST /videos/:id/bookmark` - toggle bookmark (protected)

## Important Notes
- Video files are stored in `/uploads` and served statically via `/uploads/filename`
- Do not push video files to GitHub (already ignored)
- All business logic is in services/repositories, routes only handle HTTP

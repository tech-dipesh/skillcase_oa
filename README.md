
## Tech Stack:

- **Backend**: Node.js + Express, PostgreSQL, JWT, Multer
- **Frontend**: React + Vite, Redux Toolkit, TailwindCSS, Framer Motion
## Setup

### Prerequisites
- Node.js 
- PostgreSQL (or Cloud Db )

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run migrate   
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Usage

1. Register at `http://localhost:3000/register`
2. Login
3. Upload the three provided videos using `/upload` page (or Postman to `POST /videos` with multipart/form-data)
4. Scroll the feed – videos autoplay when visible
5. Interact: like (optimistic), comment (bottom sheet), bookmark


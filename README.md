# College Event Management Portal (MERN)

## Requirements
- Node.js 20+ (18+ may work)
- MongoDB local, or a MongoDB Atlas connection string
- VS Code

## 1. Configure backend
Open a terminal in VS Code:
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and edit `MONGO_URI`.
For local MongoDB use:
`MONGO_URI=mongodb://127.0.0.1:27017/college_event_portal`
For Atlas, paste your connection string into `MONGO_URI`.
Then run:
```bash
npm run dev
```
Backend: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

## 2. Configure frontend (a second terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend: `http://localhost:5173`

Keep both terminals running. This project cannot start processes on your own computer from this chat; run these commands in VS Code.

## Features included
- List and create events
- Register a student for an event
- View registrations
- List and create notifications
- List and create results
- Download a simple participation certificate PDF (requires event and registration IDs)
- Basic API validation and duplicate-registration protection

## Important
This is a learning/demo project. Before production, add authentication/authorization, rate limiting, stronger validation, secure secrets, and deployment configuration.
"# CEMP" 

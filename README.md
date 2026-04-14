# Task Manager App

Production-ready full-stack task manager built with React, Vite, Tailwind CSS,
Node.js, Express, JWT authentication, and MongoDB with Mongoose.

## Overview

- `client`: frontend application for authentication and task management
- `server`: REST API with JWT auth, task APIs, MongoDB persistence, and production-aware config

## Folder Structure

```text
client/
  src/
    components/
    constants/
    lib/
    pages/
server/
  src/
    config/
    middleware/
    models/
    routes/
    utils/
```

## Core Features

- register and login with hashed passwords
- JWT-based protected routes
- create, list, update, delete, search, and filter tasks
- MongoDB persistence through Mongoose
- responsive UI with toast notifications and delete confirmation

## Local Setup

### 1. Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

### 2. Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`.

### 3. MongoDB

Use either:

- local MongoDB at `mongodb://127.0.0.1:27017/task-manager-app`
- MongoDB Atlas with a cloud connection string

The backend must have a reachable `MONGO_URI` before it can start.

## Environment Variables

### Client

File: `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

- `VITE_API_URL`: full backend API base URL used by the frontend

### Server

File: `server/.env`

```env
NODE_ENV=development
PORT=5000
CLIENT_URLS=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/task-manager-app
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d
```

- `NODE_ENV`: app environment, usually `development` or `production`
- `PORT`: backend port
- `CLIENT_URLS`: comma-separated allowed frontend origins for CORS
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: secret used to sign JWT tokens
- `JWT_EXPIRES_IN`: JWT expiration window

## Production Notes

- backend config is environment-based through `server/src/config/env.js`
- CORS is origin-checked using `CLIENT_URLS`
- JWT signing and verification use explicit settings and a required secret length
- production errors avoid exposing internal details to clients
- MongoDB is required for persistent users and tasks

## Build Commands

### Frontend production build

```bash
cd client
npm install
npm run build
```

This creates the production frontend in `client/dist`.

### Backend production start

```bash
cd server
npm install
npm run start
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas project and cluster.
2. Create a database user with username and password.
3. In Atlas Network Access, allow your deployment platform or current IP.
4. Copy the connection string from Atlas.
5. Put it in `server/.env` as `MONGO_URI`.
6. Replace `<password>` and any database name placeholders.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager-app?retryWrites=true&w=majority
```

## Deployment

### Frontend on Vercel

1. Import the `client` folder as a project.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Set `VITE_API_URL` to your deployed backend API URL.

### Frontend on Netlify

1. Import the repository.
2. Base directory: `client`.
3. Build command: `npm run build`.
4. Publish directory: `client/dist` or `dist` depending on platform settings.
5. Add `VITE_API_URL` in environment variables.

### Backend on Render

1. Create a new Web Service from the repository.
2. Root directory: `server`.
3. Build command: `npm install`.
4. Start command: `npm run start`.
5. Add environment variables:
   `NODE_ENV=production`
   `PORT=10000` if needed by platform
   `CLIENT_URLS=<your-frontend-url>`
   `MONGO_URI=<your-atlas-uri>`
   `JWT_SECRET=<strong-secret>`
   `JWT_EXPIRES_IN=7d`

### Backend on Railway

1. Create a new project from the repository.
2. Set service root to `server`.
3. Add the same environment variables as Render.
4. Use `npm install` and `npm run start`.

## Full Run Flow

1. Start MongoDB locally or configure Atlas.
2. Start the backend.
3. Start the frontend.
4. Register a user.
5. Log in.
6. Create, update, search, filter, and delete tasks.
7. Restart the backend and verify users/tasks still exist.

## API Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:taskId`
- `PATCH /api/tasks/:taskId/status`
- `DELETE /api/tasks/:taskId`

## Example Screenshots

Add client-facing screenshots here before delivery:

- `screenshots/login-page.png`
- `screenshots/register-page.png`
- `screenshots/dashboard-empty-state.png`
- `screenshots/dashboard-task-list.png`

Suggested README section update later:

```text
![Login Page](screenshots/login-page.png)
![Register Page](screenshots/register-page.png)
![Dashboard Empty State](screenshots/dashboard-empty-state.png)
![Dashboard Tasks](screenshots/dashboard-task-list.png)
```

## Delivery Notes

- no backend in-memory storage remains
- frontend API flow remains compatible with current routes
- deployment env vars are documented for local and hosted environments
- production-oriented config is separated from route logic

## Important Note

I did not run `npm install`, `npm run build`, `npm run dev`, or any live deployment checks in this environment.

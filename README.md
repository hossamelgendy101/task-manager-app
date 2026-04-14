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
vercel.json
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

For Vercel, set:

```env
VITE_API_URL=/api
```

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
- `PORT`: backend port for local development
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
5. Put it in your environment variables as `MONGO_URI`.
6. Replace `<password>` and any database name placeholders.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager-app?retryWrites=true&w=majority
```

## Vercel Deployment

Deploy this repository as two separate Vercel projects:

- `client` as the frontend project
- `server` as the backend project

This avoids mixed frontend/backend routing problems in a single Vercel deployment.

### 1. Backend Project On Vercel

Create a Vercel project with:

- Root Directory: `server`
- Framework Preset: `Other`

The backend project uses:

- `server/api/[...path].mjs` as the Vercel function entry
- `server/src/index.js` as the existing Express app handler

#### Backend Environment Variables

```env
NODE_ENV=production
MONGO_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<strong-secret>
JWT_EXPIRES_IN=7d
CLIENT_URLS=https://your-frontend-project.vercel.app
```

After deployment, test:

```text
https://your-backend-project.vercel.app/api/health
```

### 2. Frontend Project On Vercel

Create another Vercel project with:

- Root Directory: `client`
- Framework Preset: `Vite`

The frontend project uses:

- `client/vercel.json` for React Router SPA rewrites

#### Frontend Environment Variables

```env
VITE_API_URL=https://your-backend-project.vercel.app/api
```

### 3. Deployment Order

1. Deploy the backend project from `server`.
2. Copy the backend Vercel URL.
3. Deploy the frontend project from `client`.
4. Set `VITE_API_URL` in the frontend project to the backend URL plus `/api`.
5. Add the frontend deployed URL to backend `CLIENT_URLS`.
6. Redeploy the backend if you updated `CLIENT_URLS`.
7. Test register, login, and task CRUD from the frontend app.

### Example

If your backend URL is:

```text
https://task-manager-api.vercel.app
```

Then set:

```env
VITE_API_URL=https://task-manager-api.vercel.app/api
```

If your frontend URL is:

```text
https://task-manager-client.vercel.app
```

Then set backend:

```env
CLIENT_URLS=https://task-manager-client.vercel.app
```

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

- `screenshots/Login Dashboard.PNG`
- `screenshots/Register Dashboard.PNG`
- `screenshots/Task Dashboard.PNG`
- `screenshots/MongoDB.PNG`

Suggested README section update later:

```text
![Login Page](screenshots/Login Dashboard.PNG)
![Register Page](screenshots/Register Dashboard.PNG)
![Task Dashboard](screenshots/Task Dashboard.PNG)
![MongoDB](screenshots/MongoDB.PNG)
```

## Delivery Notes

- local development still uses `client/npm run dev` and `server/npm run dev`
- Vercel uses the same API routes under `/api/*`
- auth flow, task APIs, and MongoDB integration are unchanged

## Important Note

I did not run `vercel`, `npm run build`, or live deployment checks in this environment.

# MusicShelf 🎵

A MERN-stack app where every user keeps a personal music collection.

**Features:** register, login/logout (JWT), view your songs, add, edit, delete, search, filter by genre, sort.

## Requirements
- Node.js 18+
- MongoDB (local install, or a free MongoDB Atlas connection string)

## Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env     # on Windows: copy .env.example .env
npm run dev              # runs on http://localhost:5000
```
Edit `.env` if you use MongoDB Atlas (set `MONGO_URI`) and change `JWT_SECRET` to any long random text.

### 2. Frontend (new terminal)
```bash
cd client
npm install
npm run dev              # opens on http://localhost:5173
```
Open http://localhost:5173, register an account, and start adding songs.
The Vite dev server proxies `/api` to the backend, so no extra config is needed.

## API
| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login, returns token |
| GET | /api/auth/me | Current user |
| GET | /api/songs?search=&genre=&sort= | List your songs |
| POST | /api/songs | Add song |
| PUT | /api/songs/:id | Edit song |
| DELETE | /api/songs/:id | Delete song |
| GET | /api/songs/genres/list | Your distinct genres |

## Structure
```
server/  Express + Mongoose + JWT
client/  React (Vite) + React Router + Axios
```

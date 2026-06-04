# 🎧 Streamly — Full-Stack Music Streaming App

Streamly is a full-stack music-streaming web app with a player, playlists, podcasts, user authentication, and an admin dashboard for managing content. Built with **React**, **Vite**, **Tailwind CSS**, **Node/Express**, **MongoDB**, and **Cloudinary**.

> **Disclaimer:** Streamly is an educational project inspired by Spotify's design and UX. It is **not affiliated with, endorsed by, or connected to Spotify AB**. All product names, logos, and brands are property of their respective owners.

> The web player ships with bundled demo songs and albums, so it works out of the box even without a running backend — perfect for live demos.

## ✨ Features

- 🎵 **Full music player** — play / pause, next / previous, shuffle, repeat, auto-advance, draggable seek bar, and a working volume slider
- 🔍 **Search** — filter songs and albums live
- 📀 **Albums & songs** — browse featured charts and open album pages with track listings
- 🎨 **Dynamic theming** — album pages pick up each album's background colour
- 🧩 **Playlists** — create playlists from the library
- 🖼️ **Picture-in-Picture & Fullscreen** — pop the player out or go fullscreen
- 🛠️ **Built-in admin panel** — manage songs & albums at `/admin` (no separate app/port)
- ☁️ **Cloud storage** — media stored on Cloudinary, metadata in MongoDB
- 🔌 **Graceful fallback** — the player uses bundled demo data when no API is configured
- 📱 **Responsive UI** — styled with Tailwind CSS

## 🗂️ Project structure

```
spotify/
├── frontend/     # React + Vite app — music player (/) + admin panel (/admin)
├── backend/      # Node + Express REST API (deploy to Render/Railway)
└── assets/       # Original shared image/audio assets
```

> The admin dashboard is part of the frontend app and is reachable at the
> `/admin` route — no separate server or port.

## 🧰 Tech stack

| Layer        | Technology                                            |
| ------------ | ----------------------------------------------------- |
| Frontend     | React 18, Vite, React Router, Tailwind CSS, Axios     |
| Admin        | Same app, served at `/admin` (React Router)           |
| Backend      | Node.js, Express, Mongoose (MongoDB), Multer          |
| Storage      | Cloudinary (audio + images)                           |

## 🚀 Local development

### Prerequisites

- Node.js 18+ and npm
- (Optional, for the full backend) a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and a [Cloudinary](https://cloudinary.com) account

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGODB_URI + Cloudinary keys
npm run server         # starts on http://localhost:4000
```

### 2. Frontend (player + admin)

```bash
cd frontend
npm install
cp .env.example .env   # optional: set VITE_API_URL to your backend
npm run dev            # starts on http://localhost:5173
```

- Player: http://localhost:5173/
- Admin dashboard: http://localhost:5173/admin

> `VITE_API_URL` defaults to `http://localhost:4000` in development. If the API is
> unreachable, the player automatically falls back to bundled demo songs & albums.

## 🔑 Environment variables

**backend/.env**

| Variable               | Description                          |
| ---------------------- | ------------------------------------ |
| `PORT`                 | API port (default `4000`)            |
| `MONGODB_URI`          | MongoDB connection string            |
| `CLOUDINARY_NAME`      | Cloudinary cloud name                |
| `CLOUDINARY_API_KEY`   | Cloudinary API key                   |
| `CLOUDINARY_SECRET_KEY`| Cloudinary API secret                |

**frontend/.env**

| Variable       | Description                                |
| -------------- | ------------------------------------------ |
| `VITE_API_URL` | Base URL of the backend API (no trailing slash) |

## ☁️ Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full step-by-step instructions.

**Quick version:**

- **Frontend (player + admin) → Vercel.** Import the repo once with root directory `frontend`. Set `VITE_API_URL` to your backend URL. The admin panel ships at `/admin`.
- **Backend → Render / Railway.** A long-running Express server with file uploads is best hosted on Render or Railway (Vercel's serverless functions don't suit Multer disk uploads). Set the MongoDB + Cloudinary env vars.

## 📡 API reference

| Method | Endpoint           | Description            |
| ------ | ------------------ | ---------------------- |
| GET    | `/api/song/list`   | List all songs         |
| POST   | `/api/song/add`    | Add a song (multipart) |
| POST   | `/api/song/remove` | Remove a song by `id`  |
| GET    | `/api/album/list`  | List all albums        |
| POST   | `/api/album/add`   | Add an album (multipart) |
| POST   | `/api/album/remove`| Remove an album by `id`|

## 📝 License

MIT — free to use for learning and portfolio purposes.

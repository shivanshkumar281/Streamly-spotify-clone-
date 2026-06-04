# 🎧 Streamly — Full-Stack Music Streaming App

Streamly is a full-stack music-streaming web app with a player, playlists, podcasts, user authentication, and an admin dashboard for managing content. Built with **React**, **Vite**, **Tailwind CSS**, **Node/Express**, **MongoDB**, and **Cloudinary**.

> **Disclaimer:** Streamly is an educational project inspired by Spotify's design and UX. It is **not affiliated with, endorsed by, or connected to Spotify AB**. All product names, logos, and brands are property of their respective owners.

> The web player ships with bundled demo songs and albums, so it works out of the box even without a running backend — perfect for live demos.

## ✨ Features

- 🎵 **Full music player** — play / pause, next / previous, shuffle, repeat, auto-advance, draggable seek bar, and a working volume slider
- 🔍 **Search** — filter songs, albums, and podcasts live (scoped by category)
- 📀 **Albums & songs** — browse featured charts and open album pages with track listings and total runtime
- 🎙️ **Podcasts** — a dedicated Browse Podcasts page with audio podcasts
- 🧩 **Playlists** — create, edit (cover/name/description), make private/public, delete, and add/remove songs
- 🎨 **Dynamic theming** — album & playlist pages derive their gradient from the cover art
- 👤 **Authentication** — sign up / log in (JWT) plus an account menu to change name, password, and profile picture
- 🖼️ **Picture-in-Picture & Fullscreen** — pop the player out or go fullscreen
- 🛠️ **Password-protected admin panel** — manage songs, albums & podcasts at `/admin` (no separate app/port)
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


## 📖 How to use

### 🏠 Home
The landing page. Use the **All / Music / Podcasts** chips at the top to switch what's shown:
- **All** — Featured Charts (albums), Today's biggest hits (songs), and Podcasts.
- **Music** — songs only.
- **Podcasts** — opens the Browse Podcasts page.

Click any song or album cover to start playing or to open its page.

### ▶️ Player bar (bottom)
Controls the currently playing track:
- **Play / Pause**, **Next**, **Previous**
- **Shuffle** and **Repeat** (highlighted when active; repeat loops the current track)
- **Seek bar** — click anywhere on it or **drag the handle** to scrub; shows elapsed / total time
- **Volume slider**
- **Picture-in-Picture** — pops a mini player into a floating window (Chrome/Edge)
- **Fullscreen** toggle

Songs auto-advance to the next track when they finish.

### 🔍 Search (left sidebar → Search)
Type to search your library. The **All / Music / Podcasts** chips scope the results:
- **All** — songs, albums, and podcasts
- **Music** — songs
- **Podcasts** — podcasts only

### 📀 Album page
Opens when you click an album. Shows the cover, total song count, and combined runtime, followed by the track list (#, Title, Album, Date Added, duration). Click a track to play it. The background gradient is derived from the album's colour.

### 🎙️ Browse Podcasts (left sidebar → Browse Podcasts)
A search bar plus a **Popular Podcasts** grid of every podcast in the database. Each tile shows the cover, name, description, and duration. Click a tile to play.

### 👤 Account (sign up / log in)
- Use **Sign up** / **Log in** (top-right) to create or access an account.
- Once logged in, your avatar appears top-right. Open its menu to **Change profile picture**, **Change account name**, **Change password**, or **Log out**.
- Sessions persist across refreshes.

### 🧩 Playlists (left sidebar → Your Library)
- **Create a playlist** with the **+** button or "Create Playlist" (requires being logged in — otherwise a prompt asks you to log in).
- **Click** a playlist to open its page: a header with cover + name, the list of added songs (#, Title, Album, Date Added, duration, and a **⋯** menu to remove a song), and a search box ("Let's find something for your playlist") to find and **Add** songs from the database.
- **Right-click** a playlist in the sidebar for options: **Edit details** (change cover photo, name, and optional description), **Make private / public**, or **Delete**.
- The playlist page background gradient is derived from the first song's cover art.

### 🛠️ Admin dashboard (`/admin`)
The admin area is **password-protected** — opening `/admin` shows an "Enter Password" screen, and the panel only loads on the correct password. Leaving the admin page (or refreshing) logs you out automatically. Inside, you can:
- **Add Song** — upload an audio file + cover image, set name, description, and album; duration is computed automatically.
- **List Songs** — view all songs and delete any.
- **Add Album** — upload a cover image, set name, description, and a background colour.
- **List Albums** — view all albums and delete any.
- **Add Podcast** — upload a podcast audio file + cover image, set name and description.
- **List Podcasts** — view all podcasts and delete any.

Uploaded media is stored on Cloudinary and immediately appears across the app.


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
| `JWT_SECRET`           | Secret used to sign login tokens     |

**frontend/.env**

| Variable              | Description                                        |
| --------------------- | -------------------------------------------------- |
| `VITE_API_URL`        | Base URL of the backend API (no trailing slash)    |
| `VITE_ADMIN_PASSWORD` | Password for the `/admin` gate (set your own value) |


## ☁️ Deployment

- **Frontend (player + admin) → Vercel.** Import the repo once with root directory `frontend`. Set `VITE_API_URL` to your backend URL. The admin panel ships at `/admin`.
- **Backend → Render / Railway.** A long-running Express server with file uploads is best hosted on Render or Railway (Vercel's serverless functions don't suit Multer disk uploads). Set the MongoDB + Cloudinary env vars.

## 📡 API reference

| Method | Endpoint                    | Description                         |
| ------ | --------------------------- | ----------------------------------- |
| GET    | `/api/song/list`            | List all songs                      |
| POST   | `/api/song/add`             | Add a song (multipart)              |
| POST   | `/api/song/remove`          | Remove a song by `id`               |
| GET    | `/api/album/list`           | List all albums                     |
| POST   | `/api/album/add`            | Add an album (multipart)            |
| POST   | `/api/album/remove`         | Remove an album by `id`             |
| GET    | `/api/podcast/list`         | List all podcasts                   |
| POST   | `/api/podcast/add`          | Add a podcast (multipart)           |
| POST   | `/api/podcast/remove`       | Remove a podcast by `id`            |
| POST   | `/api/user/register`        | Register a new user (returns JWT)   |
| POST   | `/api/user/login`           | Log in (returns JWT)                |
| POST   | `/api/user/update-name`     | Update account name (auth)          |
| POST   | `/api/user/update-password` | Change password (auth)              |
| POST   | `/api/user/update-avatar`   | Update profile picture (auth, multipart) |



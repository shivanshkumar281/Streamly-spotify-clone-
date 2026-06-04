# 🚀 Deployment Guide

This guide walks you through putting the project on GitHub and deploying it.

The recommended setup:

- **Frontend (player + admin at `/admin`)** → Vercel (single project)
- **Backend API** → Render (free tier) or Railway

> Vercel is great for the two React apps. The backend is a long-running Express
> server that writes uploaded files to disk before sending them to Cloudinary,
> which does **not** fit Vercel's serverless model well — so host it on Render or
> Railway instead.

---

## 1. Push to GitHub

From the project root (`spotify/`):

```bash
git init
git add .
git commit -m "Initial commit: full-stack Spotify clone"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Create the empty repo first at https://github.com/new (don't add a README/license,
since this project already has them).

---

## 2. Deploy the Frontend (player + admin) on Vercel

1. Go to https://vercel.com → **Add New… → Project** → import your GitHub repo.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`,
   output directory `dist`.
4. Add environment variables:
   - `VITE_API_URL` = your backend URL once it's live (needed for login/signup,
     the admin panel, and podcasts). If left unset, the player still works using
     bundled demo data.
   - `VITE_ADMIN_PASSWORD` = the password for the `/admin` gate (defaults to
     `Redn1nja` if you don't set it).
5. **Deploy.** You'll get a URL like `https://your-app.vercel.app`. The admin
   dashboard is at `https://your-app.vercel.app/admin`.

## 3. Deploy the Backend on Render

1. Go to https://render.com → **New → Web Service** → connect your repo.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add environment variables:
   - `MONGODB_URI`
   - `CLOUDINARY_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_SECRET_KEY`
   - `JWT_SECRET` (a long random string — used to sign login tokens)
6. **Create Web Service.** Copy the resulting URL (e.g. `https://your-api.onrender.com`).
7. Go back to the Vercel **frontend** project, set `VITE_API_URL` to this backend
   URL, then redeploy.

---

## 4. Get free MongoDB + Cloudinary credentials

**MongoDB Atlas**

1. Create a free cluster at https://www.mongodb.com/atlas.
2. Add a database user and allow network access from anywhere (`0.0.0.0/0`).
3. Copy the connection string into `MONGODB_URI`
   (e.g. `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net`).

**Cloudinary**

1. Sign up at https://cloudinary.com.
2. From the dashboard, copy **Cloud name**, **API Key**, and **API Secret** into the
   matching backend env vars.

---

## ✅ Demo tip for interviews

Because the player falls back to bundled demo songs when `VITE_API_URL` is empty,
you can deploy just the **frontend** to Vercel and have a fully working, clickable
music player to show — no backend or accounts required. Add the backend + admin
later to demonstrate the full stack.

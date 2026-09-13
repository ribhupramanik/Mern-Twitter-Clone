# MERN Twitter Clone

**[Try the live demo](https://mern-twitter-clone-q6p5.onrender.com/)**

A full-stack social media application inspired by Twitter/X, built with MongoDB, Express, React, and Node.js. Users can publish text and image posts, follow other accounts, interact through likes and comments, and manage their profiles.

The project demonstrates how a React interface connects to an authenticated REST API, persistent social data, and cloud image storage.

**Stack:** React 19 · Express 5 · MongoDB / Mongoose 9 · Node.js · TanStack Query · Tailwind CSS 4 · Cloudinary

[Features](#features) · [Engineering highlights](#engineering-highlights) · [Local setup](#local-setup) · [Code tour](#code-tour)

## Features

- **Authentication:** Sign up, log in, and log out with JWT cookie authentication and bcrypt password hashing.
- **Posts and conversations:** Create text or image posts, delete your own posts, like/unlike posts, and add comments.
- **Social feeds:** Browse all posts in the “For you” feed or switch to posts from accounts you follow.
- **Profiles:** Edit profile details, bio, website link, profile photo, and cover image; view an account's posts and liked posts.
- **Connections:** Follow/unfollow accounts and discover suggested users.
- **Notifications:** View follow and like notifications and clear the notification list.
- **Interface feedback:** Loading skeletons, pending action indicators, and toast messages support asynchronous interactions.

## Engineering highlights

| Area | Implementation |
| --- | --- |
| Full-stack integration | React pages call Express REST endpoints, with a Vite development proxy forwarding `/api` requests to the backend. |
| Authentication | Middleware verifies JWTs for protected endpoints; the client checks the current session before rendering authenticated routes. Cookies use `httpOnly`, `sameSite: strict`, and a production `secure` flag. |
| Server state | TanStack Query manages fetching and mutations. Successful likes update the cached post data; other mutations invalidate relevant queries. |
| Data modeling | Mongoose models connect users, posts, and notifications through document references, with comments embedded in posts. |
| Media handling | The backend uploads post and profile images to Cloudinary and stores image URLs in MongoDB. |
| Code organization | Backend routes, controllers, models, and middleware are separated; the frontend shares components and custom hooks across pages. |
| Deployment structure | In production mode, Express serves the compiled React application and the API from the same server. |

## Local setup

### Prerequisites

- Node.js **22.12 or newer** and npm.
- A running MongoDB instance or a MongoDB Atlas connection string.
- A Cloudinary account and API credentials to use image uploads.

### 1. Clone and install

```bash
git clone https://github.com/ribhupramanik/Mern-Twitter-Clone.git
cd Mern-Twitter-Clone
npm install
npm install --prefix frontend
```

### 2. Configure the backend

Create a `.env` file in the repository root:

```dotenv
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_twitter_clone
JWT_SECRET=replace_with_a_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Replace the placeholders with your own values. Use your Atlas connection string for `MONGO_URI` if you are using Atlas. The root `.env` file is excluded from Git; keep credentials there. The npm scripts set `NODE_ENV` automatically.

### 3. Start development servers

From the repository root, start the backend:

```bash
npm run dev
```

In a second terminal, also from the repository root, start the frontend:

```bash
npm run dev --prefix frontend
```

Open [localhost:3000](http://localhost:3000). The API runs on port **5000**. If you change the backend port, update the proxy target in [`frontend/vite.config.js`](frontend/vite.config.js).

### Try the main workflow

1. Create an account and update your profile.
2. Publish a text post and a post with an image.
3. Create a second account in a separate browser session.
4. Follow the first account, browse the Following feed, and like/comment on a post.
5. Return to the first account and open Notifications to see the follow and like activity.

## Scripts and production build

Run these commands from the repository root:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the backend with Nodemon in development mode. |
| `npm run dev --prefix frontend` | Start the Vite development server. |
| `npm run lint --prefix frontend` | Run the frontend ESLint checks. |
| `npm run build --prefix frontend` | Compile the frontend into `frontend/dist`. |
| `npm run build` | Install backend/frontend dependencies and compile the frontend. |
| `npm start` | Start Express in production mode and serve the compiled frontend. |

For production, run `npm run build` followed by `npm start`, provide the same environment variables through your hosting environment, and serve the application over HTTPS because authentication cookies are marked secure in production.

## Code tour

| Location | What to review |
| --- | --- |
| [`frontend/src/App.jsx`](frontend/src/App.jsx) | Session lookup and authenticated page routing. |
| [`frontend/src/components/common/Post.jsx`](frontend/src/components/common/Post.jsx) | Post interactions, mutations, and cache updates. |
| [`frontend/src/hooks`](frontend/src/hooks) | Reusable follow and profile update logic. |
| [`frontend/src/pages`](frontend/src/pages) | Authentication, home feed, profile, and notification screens. |
| [`backend/server.js`](backend/server.js) | Express configuration, API mounting, and production static hosting. |
| [`backend/middleware/protectRoute.js`](backend/middleware/protectRoute.js) | JWT verification and authenticated user lookup. |
| [`backend/controllers`](backend/controllers) | Authentication, user relationships, posts, notifications, and media handling. |
| [`backend/models`](backend/models) | User, post, and notification schemas. |

### API overview

| Base path | Responsibilities |
| --- | --- |
| `/api/auth` | Signup, login, logout, and current session (`/me`). |
| `/api/users` | Profiles, suggested users, follow/unfollow, and profile updates. |
| `/api/posts` | All/following/user/liked feeds, post creation/deletion, likes, and comments. |
| `/api/notifications` | Fetch notifications, mark them read on retrieval, and clear them. |

User, post, and notification endpoints require authentication, as does `/api/auth/me`.

## Current scope

The “For you” feed lists posts in reverse chronological order. Notifications are fetched through HTTP requests. Repost and bookmark icons are present as interface placeholders. Automated tests are not currently configured in the package scripts.

## Author

[Ribhu Pramanik](https://github.com/ribhupramanik)

# 🚀 QuickBlog

🔥 A modern full-stack blogging platform with role-based authentication, real-time comments, and author dashboards.

Built using ⚡ React, TypeScript, Node.js, Express, PostgreSQL, Prisma, and Socket.io.

---

# ✨ Features

## 🔐 Authentication & Authorization

* 🔑 JWT-based authentication
* 🛡️ Role-based access control (Author / Reader)
* 🚧 Protected API routes
* 🔒 Protected frontend routes
* ✅ Middleware-based authorization

---

## 📝 Blog Management

* ✍️ Create, update, delete blogs
* 📢 Publish / unpublish blogs
* 🔗 SEO-friendly slug support
* ♻️ Soft delete functionality
* 👨‍💻 Author-specific dashboard management

---

## 🌍 Public Features

* 📰 Public homepage with published blogs
* 📖 Blog detail pages
* 💬 Live comment system using Socket.io
* ⚡ Real-time comment updates without refresh

---

## 💭 Comments

* 🗨️ Create comments on blogs
* 📡 Real-time comment broadcasting
* 🏠 Blog-specific live comment rooms

---

# 🏗️ Backend Architecture

* 🧩 Layered architecture (Controller → Service → DB)
* 📋 Zod validation
* ⚠️ Centralized error handling
* 📦 Reusable API response structure
* 🛢️ Prisma ORM with PostgreSQL
* 🧱 Modular route structure

---

# 🎨 Frontend Architecture

* ⚛️ React + TypeScript
* 🎨 TailwindCSS
* ♻️ Reusable component structure
* 🚧 Protected routes
* 🌐 Axios service layer
* ⚡ Socket.io integration

---

# 🛠️ Tech Stack

## 💻 Frontend

* ⚛️ React
* 📘 TypeScript
* 🎨 TailwindCSS
* 🌍 React Router DOM
* 📡 Axios
* ⚡ Socket.io Client

---

## 🖥️ Backend

* 🟢 Node.js
* 🚂 Express.js
* 📘 TypeScript
* 🐘 PostgreSQL
* 🔺 Prisma ORM
* 🔐 JWT Authentication
* ⚡ Socket.io
* 📋 Zod Validation

---

# 📂 Folder Structure

## 🎨 Frontend

```bash
src/
├── api/
├── assets/
├── components/
├── pages/
├── routes/
├── services/
├── socket/
├── store/
├── hooks/
├── utils/
├── validations/
├── types/
└── layouts/
```

---

## 🖥️ Backend

```bash
src/
├── config/
├── controllers/
├── middlewares/
├── modules/
├── routes/
├── services/
├── sockets/
├── utils/
├── validations/
└── prisma/
```

---

# 🗄️ Database Schema Overview

## 👤 Users

| Field     | Type            |
| --------- | --------------- |
| id        | String          |
| name      | String          |
| email     | String          |
| password  | String          |
| role      | AUTHOR / READER |
| createdAt | DateTime        |
| updatedAt | DateTime        |

---

## 📝 Posts

| Field       | Type     |
| ----------- | -------- |
| postId      | String   |
| title       | String   |
| slug        | String   |
| body        | Text     |
| isPublished | Boolean  |
| authorId    | FK       |
| createdAt   | DateTime |
| updatedAt   | DateTime |
| deletedAt   | DateTime |

---

## 💬 Comments

| Field     | Type     |
| --------- | -------- |
| commentId | String   |
| message   | Text     |
| postId    | FK       |
| userId    | FK       |
| createdAt | DateTime |
| updatedAt | DateTime |

---

# 👥 Role Permissions

| Feature              | Reader | Author |
| -------------------- | ------ | ------ |
| 📖 Read Blogs        | ✅      | ✅      |
| 💬 Create Comments   | ✅      | ✅      |
| ✍️ Create Blogs      | ❌      | ✅      |
| 🛠️ Edit Own Blogs   | ❌      | ✅      |
| 🗑️ Delete Own Blogs | ❌      | ✅      |
| 📢 Publish Blogs     | ❌      | ✅      |
| 📊 Access Dashboard  | ❌      | ✅      |

---

# 🌐 API Endpoints

## 🔐 Auth Routes

```http
POST /auth/register
POST /auth/login
POST /auth/logout
```

---

## 📝 Blog Routes

```http
GET    /blogs
GET    /blogs/:id
POST   /blogs
PUT    /blogs/:id
DELETE /blogs/:id
```

---

## 💬 Comment Routes

```http
GET  /blogs/:id/comments
POST /blogs/:id/comments
```

---

# ⚡ Real-Time Features

Socket.io powers:

* 💬 Live comments
* 🏠 Blog-specific comment rooms
* ⚡ Real-time UI updates

### 🔄 Real-time flow

```bash
User comments
    ↓
Backend emits socket event
    ↓
All connected viewers receive comment instantly
```

---

# 🔑 Environment Variables

Create a `.env` file in backend root.

```env
PORT=5000

DATABASE_URL=your_postgresql_database_url

JWT_SECRET_KEY=your_jwt_secret

CLIENT_URL=http://localhost:5173
```

---

# 🚀 Installation

## 📥 Clone Repository

```bash
git clone <your-repo-url>
```

---

## 🖥️ Backend Setup

```bash
cd backend

pnpm install

pnpm prisma migrate dev

pnpm dev
```

---

## 🎨 Frontend Setup

```bash
cd frontend

pnpm install

pnpm dev
```

---

# 📜 Scripts

## 🖥️ Backend

```bash
pnpm dev
pnpm build
pnpm prisma migrate dev
pnpm prisma studio
```

---

## 🎨 Frontend

```bash
pnpm dev
pnpm build
pnpm preview
```

---

# 🛡️ Security Features

* 🔒 Password hashing
* 🔑 JWT verification
* 🚫 Token blacklist support
* 🚧 Protected routes
* 👮 Role enforcement
* ♻️ Soft delete support
* 📋 Request validation using Zod

---

# ⚠️ Error Handling

The application includes:

* 📌 Centralized API error handling
* 📦 Standardized API responses
* ✅ Proper HTTP status codes
* ❌ Validation error responses

---

# 🚀 Future Improvements

* ❤️ Blog likes
* 🧵 Nested comments
* 🔍 Search & filtering
* 📄 Pagination improvements
* ✨ Rich text editor
* 👤 Author profiles
* 🖼️ Image uploads
* 🔖 Bookmark system

---

# 🌿 Git Workflow

This project follows:

* 🌱 Feature branch workflow
* ✍️ Meaningful commits
* 🔀 Pull request-based development

---

# 📚 Learning Outcomes

This project helped practice:

* 🛡️ RBAC implementation
* ⚡ Real-time communication
* 🏗️ Backend architecture
* 🔺 Prisma ORM
* 🔐 Authentication systems
* ⚡ Socket.io integration
* 🌐 Full-stack TypeScript development

---

# 👨‍💻 Author

Developed by **Dhruvin** 🚀

---

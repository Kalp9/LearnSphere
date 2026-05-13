# LearnSphere

LearnSphere is a full stack MERN online course selling platform with JWT authentication, protected course access, admin course management, MongoDB persistence, password reset email flow, and Razorpay payment verification.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router DOM, Axios, Context API
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Nodemailer, Razorpay
- Database: MongoDB Atlas compatible schemas

## Project Structure

```text
LearnSphere/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── uploads/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── package.json
└── README.md
```

## Quick Start

Install all workspace dependencies from the root:

```bash
npm install
```

Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

For a zero-config local demo, the backend starts with an in-memory MongoDB database if `MONGO_URI` is not set and uses a development JWT secret if `JWT_SECRET` is missing. For persistent data and production use, configure MongoDB Atlas and a strong JWT secret in `backend/.env`.

Start both apps from the root:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`

## Environment Variables

Backend `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/learnsphere
AUTO_SEED=true
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
COOKIE_DOMAIN=localhost

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="LearnSphere <your_email@gmail.com>"

RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

Frontend `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas project and cluster.
2. Create a database user with read/write permissions.
3. Add your IP address to Network Access, or allow Render's outbound access for deployment.
4. Copy the connection string into `backend/.env` as `MONGO_URI`.
5. Run seed data:

```bash
npm run seed
```

In development, `AUTO_SEED=true` also seeds the database automatically when the course collection is empty.

Seed admin account:

- Email: `admin@learnsphere.com`
- Password: `Admin@12345`

## Razorpay Setup

1. Create or login to a Razorpay account.
2. Open Dashboard → Account & Settings → API Keys.
3. Generate test keys.
4. Put the key id and key secret in `backend/.env`.
5. The frontend fetches the public key from `/api/payments/key`.
6. Orders are created on the backend and verified with HMAC SHA256 before a course is enrolled.

## Email Setup

Forgot password uses Nodemailer. For Gmail, create an App Password and use it as `SMTP_PASS`. If SMTP variables are missing in development, the API will not crash, but reset emails will not be delivered.

## Available Scripts

Root:

```bash
npm run dev      # start backend and frontend together
npm run build    # build frontend
npm run start    # start backend
npm run seed     # seed sample courses and admin
```

Backend:

```bash
npm run dev
npm run start
npm run seed
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
```

## API Overview

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `PUT /api/auth/reset-password/:token`

Courses:

- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/courses` admin
- `PUT /api/courses/:id` admin
- `DELETE /api/courses/:id` admin

Users:

- `GET /api/users/enrolled`
- `GET /api/users/orders`
- `PUT /api/users/profile`
- `GET /api/users` admin
- `PUT /api/users/:id/role` admin
- `DELETE /api/users/:id` admin

Payments:

- `GET /api/payments/key`
- `POST /api/payments/create-order`
- `POST /api/payments/verify`
- `POST /api/payments/failed`

Admin:

- `GET /api/admin/stats`

## Deployment

### Vercel Frontend

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Set the root directory to `frontend`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add environment variable:

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

7. Deploy.

### Render Backend

1. Create a new Web Service in Render from your GitHub repository.
2. Set root directory to `backend`.
3. Build command:

```bash
npm install
```

4. Start command:

```bash
npm run start
```

5. Add environment variables from `backend/.env.example`.
6. Set `NODE_ENV=production`.
7. Set `CLIENT_URL` to your Vercel frontend URL.
8. Deploy the service.

After deployment, update the Vercel `VITE_API_URL` to point at the Render backend URL and redeploy the frontend.

## Production Notes

- Use a strong random `JWT_SECRET`.
- Use HTTPS URLs in production.
- Keep Razorpay secret keys only on the backend.
- Configure MongoDB Atlas network access for production.
- Use a durable object store for uploaded thumbnails if deploying at scale, because Render disk storage is ephemeral.

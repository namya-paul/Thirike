# 🔍 Thirike — Find What's Yours

A community-driven, location-based **Lost & Found platform** built with React, Node.js, Express, and MongoDB.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google Maps API key

---

### 1. Clone & Setup

```bash
git clone https://github.com/yourusername/thirike.git
cd thirike
```

---

### 2. Start the Backend (Server)

```bash
cd server
npm install

# Create .env file (already included as template)
# Edit server/.env and fill in your values:
#   MONGO_URI=mongodb://localhost:27017/thirike
#   JWT_SECRET=your_secret
#   EMAIL_USER=your@gmail.com
#   EMAIL_PASS=your_app_password

npm run dev       # development (nodemon)
# or
npm start         # production
```

Server runs at: `http://localhost:5000`

---

### 3. Seed the Database (Optional)

```bash
cd server
node seed.js
```

---

### 4. Start the Frontend (Client)

```bash
cd client
npm install

# Edit client/.env:
#   REACT_APP_GOOGLE_MAPS_API_KEY=your_key
#   REACT_APP_API_URL=http://localhost:5000/api

npm start
```

Client runs at: `http://localhost:3000`

---

## 📁 Project Structure

```
thirike/
├── client/                        # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js + .css
│   │   │   ├── Footer.js + .css
│   │   │   ├── LostForm.js        # Multi-step lost item form
│   │   │   ├── FoundForm.js       # Multi-step found item form
│   │   │   ├── ItemCard.js + .css
│   │   │   ├── MapPicker.js + .css # Google Maps integration
│   │   │   └── ItemForm.css       # Shared form styles
│   │   ├── pages/
│   │   │   ├── Home.js + .css     # Landing page
│   │   │   ├── ReportLost.js      # Lost item report page
│   │   │   ├── ReportFound.js     # Found item report page
│   │   │   ├── Dashboard.js + .css # Browse all items
│   │   │   └── ItemDetail.js + .css # Single item view + claim
│   │   ├── services/
│   │   │   └── api.js             # All API calls (axios)
│   │   ├── App.js                 # Router
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css              # Global styles & CSS variables
│   ├── .env                       # Client env (Google Maps API key)
│   └── package.json
│
└── server/                        # Node.js + Express backend
    ├── config/
    │   └── db.js                  # MongoDB connection
    ├── models/
    │   ├── LostItem.js            # Lost item schema (with encryption)
    │   ├── FoundItem.js           # Found item schema
    │   └── User.js                # User schema (OTP, auth)
    ├── controllers/
    │   ├── lostController.js      # CRUD for lost items
    │   ├── foundController.js     # CRUD for found items
    │   ├── matchController.js     # Location + feature matching
    │   └── authController.js      # Register, login, OTP
    ├── routes/
    │   ├── lostRoutes.js          # /api/lost
    │   ├── foundRoutes.js         # /api/found
    │   ├── matchRoutes.js         # /api/match
    │   └── authRoutes.js          # /api/auth
    ├── middleware/
    │   ├── upload.js              # Multer image upload
    │   └── authMiddleware.js      # JWT verification
    ├── uploads/                   # Uploaded images (gitignored)
    ├── seed.js                    # Sample data seeder
    ├── server.js                  # Express app entry
    ├── .env                       # Server environment variables
    └── package.json
```

---

## 🗺️ API Endpoints

| Method | Route                   | Description              |
|--------|-------------------------|--------------------------|
| GET    | /api/lost               | List lost items (filter) |
| POST   | /api/lost               | Report lost item         |
| GET    | /api/lost/:id           | Get single lost item     |
| PATCH  | /api/lost/:id           | Update status            |
| DELETE | /api/lost/:id           | Delete report            |
| POST   | /api/lost/:id/claim     | Submit ownership claim   |
| GET    | /api/found              | List found items         |
| POST   | /api/found              | Report found item        |
| GET    | /api/found/:id          | Get single found item    |
| GET    | /api/match/lost/:id     | Match found items        |
| GET    | /api/match/found/:id    | Match lost items         |
| POST   | /api/auth/register      | Register                 |
| POST   | /api/auth/login         | Login                    |
| POST   | /api/auth/send-otp      | Send OTP                 |
| POST   | /api/auth/verify-otp    | Verify OTP               |
| GET    | /api/auth/me            | Get profile (auth)       |

---

## 🔐 Security Features

- **AES-256 encryption** on sensitive fields (email, phone, secret identifiers, verification answers)
- **OTP verification** for Important Documents category
- **JWT authentication** with expiry
- **Private contact info** — never exposed in public API responses
- **Masked document IDs** — only last 4 digits stored
- **Image upload limits** — 5MB max, images only

---

## 🛠 Tech Stack

| Layer       | Technology          |
|-------------|---------------------|
| Frontend    | React 18, React Router v6 |
| Maps        | Google Maps API (`@react-google-maps/api`) |
| HTTP Client | Axios               |
| Backend     | Node.js + Express   |
| Database    | MongoDB + Mongoose  |
| Auth        | JWT + bcryptjs      |
| OTP / Email | Nodemailer (Gmail)  |
| File Upload | Multer              |
| Deployment  | Vercel (FE) + Render (BE) + MongoDB Atlas |

---

## 🌐 Deployment

**Frontend → Vercel**
```bash
cd client
npm run build
# Deploy /build to Vercel
```

**Backend → Render**
- Set env variables in Render dashboard
- Set start command: `node server.js`

**Database → MongoDB Atlas**
- Create free cluster at mongodb.com/atlas
- Set `MONGO_URI` to Atlas connection string

---

## 📄 License
MIT — Free to use and modify.

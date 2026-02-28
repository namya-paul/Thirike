# 🔍 Thirike — Find What's Yours

> *"Thirike" means "back" in Malayalam — we help reunite people with their lost belongings.*

**Thirike** is a community-driven, AI-powered **Lost & Found platform** with location-based matching, image similarity analysis using Claude Vision AI, and secure claim verification. Built for Kerala and beyond.

**Team: KHIA ASYLUM**

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6 |
| Maps | Leaflet.js + OpenStreetMap (free, no API key) |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose (Geospatial indexing) |
| AI Matching | Anthropic Claude Vision API (image similarity) |
| Auth | JWT + bcryptjs |
| OTP / Email | Nodemailer (Gmail SMTP) |
| File Upload | Multer |
| Encryption | AES-256-CBC (sensitive fields) |
| Deployment | Vercel (Frontend) + Render (Backend) + MongoDB Atlas |

---

## ✨ Features

1. **📍 Location-Based Matching** — Uses MongoDB geospatial queries (`$near`) to find lost/found items within a configurable radius (1–20 km). Only relevant nearby items are shown.
2. **🤖 AI Image Similarity** — Uploads photos of lost and found items are compared using Claude Vision API. The AI analyzes shape, color, brand markings, and wear patterns, returning a similarity score (0–100), confidence level, matching features, and differences.
3. **🔐 Secure Claim Verification** — AES-256 encryption on emails, phones, and secret identifiers. Important documents require OTP verification before a claim can be submitted.
4. **📋 Multi-Step Smart Forms** — Guided forms for reporting lost/found items with category-specific fields, live map pinning, image upload, and review step before submission.
5. **🗺 Interactive Map Pinning** — Click-to-pin map using Leaflet + OpenStreetMap with reverse geocoding (Nominatim) and a configurable search radius circle overlay.
6. **🔎 Combined Score Ranking** — Match results are ranked by a weighted combined score: 60% feature/attribute similarity + 40% AI image similarity.
7. **📊 Feature Score Breakdown** — Each match shows individual scores for category, color, brand, distinctive features keyword overlap, and item name — visualized as score bars.
8. **🚔 Police Handover Tracking** — Found items can be marked as handed to a police station, with station name recorded.

---

## 🖼 Screenshots

> *(Add screenshots to `docs/screenshots/` and update the paths below)*

| Home Page | Report Lost Form | 
|---|---|
|(https://drive.google.com/file/d/15ilaGx2FTYHvCL2-X_b3W3qYpiyO52oD/view?usp=drivesdk) |(https://drive.google.com/file/d/1SxrDeorVX2fw3e970BHtdK1Nu6GrVFgB/view?usp=drivesdk) |

| Dashboard | found form | 
|---|---|
|(https://drive.google.com/file/d/1RK0w0P1XBkFpf1IndV1OUKw3Cjr7A44O/view?usp=drivesdk) | (https://drive.google.com/file/d/1a9P8vBW5YBsPHkTGo1njSQy_CRI9Ip-H/view?usp=drivesdk) | 

---

## 🎬 Demo Video

> 📹 [Watch Demo Video](https://drive.google.com/file/d/16WeNpN5JoC2TLeLrwOvEfrsR9fnHx2rc/view?usp=drivesdk)  
> *(Upload to YouTube/Google Drive and paste link here)*

---

## 🏗 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                       │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────┐  │
│  │   Home   │  │Dashboard │  │ReportLost │  │ Matches  │  │
│  │  Page    │  │  Browse  │  │ReportFound│  │ Results  │  │
│  └──────────┘  └──────────┘  └───────────┘  └──────────┘  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Components: Navbar, MapPicker, ItemCard      │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              services/api.js (Axios)                 │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP / REST API
┌────────────────────────────▼────────────────────────────────┐
│                    SERVER (Node + Express)                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐ │
│  │  /api/lost │  │/api/found  │  │    /api/match          │ │
│  │  /api/auth │  │/api/docs   │  │  Location + AI Match   │ │
│  └────────────┘  └────────────┘  └────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        Middleware: JWT Auth, Multer Upload           │   │
│  └─────────────────────────────────────────────────────┘   │
└──────┬────────────────────────────────────┬─────────────────┘
       │                                    │
┌──────▼──────┐                    ┌────────▼────────┐
│  MongoDB    │                    │  Anthropic API  │
│  Atlas      │                    │  Claude Vision  │
│ (GeoIndex)  │                    │ Image Matching  │
└─────────────┘                    └─────────────────┘
```

---

## 🔄 App Flow Diagram

```
User visits Thirike
       │
       ├──► Browse Dashboard ──► Filter by type/category/search
       │           │
       │           └──► Click Item ──► View Detail ──► 🔍 Find Matches
       │                                                      │
       │                                          Location Filter (MongoDB $near)
       │                                                      │
       │                                          Feature Score (category/color/brand)
       │                                                      │
       │                                          AI Image Comparison (Claude Vision)
       │                                                      │
       │                                          Ranked Match Results with Visual Compare
       │
       ├──► Report Lost Item
       │       │
       │       ├─ Fill details (name, category, color, brand, features)
       │       ├─ Pin location on map (Leaflet)
       │       ├─ Upload photo
       │       ├─ Set search radius
       │       └─ Submit → stored in MongoDB
       │
       └──► Report Found Item
               │
               ├─ Fill details + upload mandatory photo
               ├─ Pin location on map
               └─ Submit → stored with finder contact (encrypted)
```

---

## 📦 Installation

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account
- Anthropic API key (for AI image matching) — get one at [console.anthropic.com](https://console.anthropic.com)

### 1. Clone the repository

```bash
git clone https://github.com/KHIA-ASYLUM/thirike.git
cd thirike
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create/edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://thirike:thirike123@cluster0.nyjxoir.mongodb.net/
# For MongoDB Atlas: mongodb+srv://<user>:<pass>@cluster.mongodb.net/thirike

JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Email (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# For SMS OTP (Twilio or similar)
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE=

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Encryption key for sensitive data
ENCRYPTION_KEY=your_32_char_encryption_key_here_
```

### 3. Setup the Frontend

```bash
cd client
npm install
```

Edit `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ▶️ Run Commands

### Start Backend (Terminal 1)

```bash
cd server
npm run dev        # development with nodemon (auto-restart)
# OR
npm start          # production
```

Backend runs at: `http://localhost:5000`

### Start Frontend (Terminal 2)

```bash
cd client
npm start
```

Frontend runs at: `http://localhost:3000`

### Seed Sample Data (Optional)

```bash
cd server
node seed.js
```

---

## 📁 Folder Structure

```
thirike/
├── README.md
├── LICENSE
├── .gitignore
├── docs/
│   ├── screenshots/
│   └── diagrams/
├── client/                        # React frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── Navbar.js/css      # Top navigation bar
│       │   ├── Footer.js/css      # Footer
│       │   ├── LostForm.js        # Multi-step lost item form
│       │   ├── FoundForm.js       # Multi-step found item form
│       │   ├── ItemCard.js/css    # Card with Find Matches button
│       │   ├── MapPicker.js/css   # Leaflet map with pin + radius
│       │   └── ItemForm.css       # Shared form styles
│       ├── pages/
│       │   ├── Home.js/css        # Landing page
│       │   ├── Dashboard.js/css   # Browse all items
│       │   ├── ReportLost.js      # Report lost item page
│       │   ├── ReportFound.js     # Report found item page
│       │   ├── ItemDetail.js/css  # Single item + claim form
│       │   └── MatchResults.js/css # AI match results page
│       ├── services/
│       │   └── api.js             # All Axios API calls
│       └── styles/
│           └── global.css
└── server/                        # Node.js + Express backend
    ├── config/
    │   └── db.js                  # MongoDB connection
    ├── controllers/
    │   ├── lostController.js      # CRUD for lost items
    │   ├── foundController.js     # CRUD for found items
    │   ├── matchController.js     # Location + AI image matching
    │   └── authController.js      # Auth, OTP
    ├── middleware/
    │   ├── authMiddleware.js      # JWT verification
    │   └── upload.js              # Multer image upload config
    ├── models/
    │   ├── LostItem.js            # Schema with AES-256 encryption
    │   ├── FoundItem.js           # Found item schema
    │   └── User.js                # User schema
    ├── routes/
    │   ├── lostRoutes.js          # /api/lost
    │   ├── foundRoutes.js         # /api/found
    │   ├── matchRoutes.js         # /api/match
    │   └── authRoutes.js          # /api/auth
    ├── uploads/                   # Uploaded images (gitignored)
    ├── seed.js                    # Sample data seeder
    └── server.js                  # Express entry point
```

---

## 🗺 API Documentation

### Lost Items

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/lost` | List lost items (supports `?category=`, `?status=`) |
| POST | `/api/lost` | Report a lost item (multipart/form-data) |
| GET | `/api/lost/:id` | Get a single lost item |
| PUT | `/api/lost/:id` | Update a lost item |
| DELETE | `/api/lost/:id` | Delete a lost item report |
| POST | `/api/lost/:id/claim` | Submit an ownership claim |

### Found Items

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/found` | List found items |
| POST | `/api/found` | Report a found item (multipart/form-data) |
| GET | `/api/found/:id` | Get a single found item |
| PUT | `/api/found/:id` | Update a found item |
| DELETE | `/api/found/:id` | Delete a found item |

### AI Matching

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/match/lost/:id` | Find found items matching a lost item (location + features + AI image) |
| GET | `/api/match/found/:id` | Find lost items matching a found item |

**Match Response Example:**
```json
{
  "lostItem": { "itemName": "Black Wallet", "category": "Accessories" },
  "matches": [
    {
      "item": { "_id": "...", "itemName": "Leather Wallet", "locationName": "Kozhikode Beach" },
      "featureScore": 75,
      "distanceKm": 1.2,
      "imageSimilarity": {
        "score": 82,
        "confidence": "high",
        "reasoning": "Both images show a black bifold wallet with similar stitching.",
        "matchingFeatures": ["black color", "leather texture", "card slots"],
        "differences": ["minor wear on corner"]
      },
      "combinedScore": 78
    }
  ],
  "totalMatches": 3
}
```

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT) |
| POST | `/api/auth/send-otp` | Send OTP to email |
| POST | `/api/auth/verify-otp` | Verify OTP |
| GET | `/api/auth/me` | Get current user profile (requires JWT) |

---

## 🔐 Security

- **AES-256-CBC encryption** on all sensitive fields: email, phone, secret identifiers, verification answers
- **OTP verification** mandatory for Important Documents category
- **JWT authentication** with configurable expiry
- **Private contact info** — finder emails/phones never exposed in public API responses
- **Masked document IDs** — only last 4 digits stored in database
- **Multer file validation** — images only, 5MB max size limit

---

## 🚀 Deployment

### Frontend → Vercel
```bash
cd client
npm run build
# Deploy the /build folder to Vercel
```

### Backend → Render
- Connect GitHub repo in Render dashboard
- Set all environment variables from `server/.env`
- Start command: `node server.js`

### Database → MongoDB Atlas
- Create a free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Whitelist `0.0.0.0/0` for Render's dynamic IPs
- Set `MONGO_URI` to your Atlas connection string

---

## 👥 Team Members

**Team Name: KHIA ASYLUM**

| Name | Role |
|---|---|
NAMYA client-server
KRISHNA client-server

---

## 🤖 AI Tools Used

| Tool | How it was used |
|---|---|
| Claude (Anthropic) | AI image similarity matching between lost and found item photos |
| Claude (Anthropic) | Code assistance during development |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 KHIA ASYLUM

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

# DocuLink - Educational Document Sharing Platform

**DocuLink** is a document-sharing and learning platform designed specifically for Cambodian high school and university students, inspired by Studocu.

> "Discover, Share, and Learn Together"

## 🌟 Key Features

- **Multi-Format Uploads**: Support for PDF, DOCX, PPTX, and Images.
- **Advanced Search**: Filter by School, Major, Grade, Semester, and Category.
- **Social Learning**: Like, Comment, Follow contributors, and Favorite documents.
- **Book Section**: Dedicated area for textbooks and reference materials.
- **Admin Dashboard**: Full control over users, document approvals, and analytics.

## 🛠️ Tech Stack

### Frontend
- **React 18 + Vite** (Fast build times)
- **TypeScript** (Type safety)
- **Tailwind CSS** (Modern styling)
- **TanStack Query** (Efficient data fetching)
- **Zustand** (Lightweight state management)

### Backend
- **Laravel 12** (Robust API)
- **Sanctum** (Secure authentication)
- **Spatie Permissions** (Role-based access control)
- **Repository-Service Pattern** (Clean, scalable architecture)

## 📂 Project Structure
```text
DocuLink/
├── frontend/          # React frontend
├── backend/           # Laravel REST API
├── docker-compose.yml # Docker configuration
└── README.md          # This file
```

## 🚀 Installation & Setup

### Using Docker (Recommended)
```bash
docker-compose up -d --build
```
Access the app at `http://localhost:3000` and API at `http://localhost:8000`.

### Local Manual Setup

#### 1. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configure DB in .env
php artisan migrate --seed
php artisan serve
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Admin Credentials
- **Email**: `admin@doculink.com`
- **Password**: `password`

## 📄 License
MIT License. Created for the Cambodian student community.

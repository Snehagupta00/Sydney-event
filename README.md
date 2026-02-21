# 🌆 Sydney Events Hub

A premium, state-of-the-art event discovery and management platform. Designed with a sleek "Cyberpunk-lite" aesthetic, this application provides a seamless experience for users to find the best events in Sydney and for admins to manage them with precision.

---

## ✨ Features

### **🎨 Visual Excellence**

- **Premium Aesthetics**: High-end dark mode design featuring glassmorphism, vibrant indigo/violet accents, and fluid animations.
- **Dynamic UI**: Fully responsive layout with smooth transitions and micro-animations for an elite user experience.

### **🔐 Robust Authentication**

- **Seamless Login Experience**: Stunning split-pane login/signup layout with horizontal sliding transitions.
- **Google OAuth 2.0**: One-tap secure registration and login powered by Google.
- **Role-Based Access**: Multi-tier architecture supporting regular Users and privileged Administrators.

### **🛡️ Admin Dashboard**

- **Event Management**: Centralized hub to search, filter, and inspect detailed event records.
- **Data Synchronization**: Trigger automated scrapers to fetch the latest happenings across Sydney in real-time.
- **Analytics at a Glance**: KPI cards showing total events, active listings, and sync status.

### **🕷️ Intelligent Scraper**

- **What's On Sydney Integration**: Robust data extraction from city council sources using automated JSON parsing from Next.js endpoints.
- **Multi-Source Ready**: Built to scale across various event providers like Eventbrite and council pages.
- **Automated Sync**: Background cron jobs keeping the database fresh every hour.

---

## 🚀 Tech Stack

### **Frontend**

- **React.js**: High-performance UI rendering.
- **Tailwind CSS**: Modern, utility-first styling.
- **Lucide React**: Crisp, professional iconography.
- **Vite**: Ultra-fast build tool and development server.

### **Backend**

- **Node.js & Express**: Scalable server architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database for complex event metadata.
- **Passport.js**: Secure authentication middleware.
- **Cheerio & Axios**: Advanced scraping engine.

---

## 🛠️ Setup & Installation

### **Prerequisites**

- Node.js (v18+)
- MongoDB Atlas Account
- Google Cloud Console Project (for OAuth)

### **1. Clone the Repository**

```bash
git clone https://github.com/yourusername/sydney-events.git
cd sydney-events
```

### **2. Configuration**

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@sydneyevents.com
ADMIN_PASSWORD=your_password
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### **3. Install Dependencies**

```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### **4. Run the Application**

```bash
# Start Backend (from /server)
npm run dev

# Start Frontend (from /client)
npm run dev
```

---

## 📜 Principles

- **Clean Code**: Zero comments in source files for a lean, production-focused codebase.
- **Performance**: Optimized API calls and lazy loading for lightning-fast interactions.
- **Security**: Strict environment variable management and manual signup blocks for admin identities.

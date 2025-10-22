# Mateos Platform - Frontend Application

> Premium educational platform connecting students with qualified math teachers for personalized consultations.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.15-38B2AC?logo=tailwind-css)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Features](#features)
- [Development](#development)
- [Build & Deployment](#build--deployment)
- [Documentation](#documentation)

---

## 🎯 Overview

Mateos is a premium educational platform that connects students with qualified math teachers for personalized consultations. The platform supports:

- **4 User Roles:** Parent, Student, Teacher, Admin
- **Individual & Group Consultations**
- **Subscription-based Model**
- **GDPR Compliant**
- **Real-time Features**

---

## 🛠️ Tech Stack

### Core

- **React 19.1.1** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.1.7** - Build tool
- **React Router 6** - Client-side routing

### UI & Styling

- **Tailwind CSS 4.1.15** - Utility-first CSS
- **shadcn/ui v4** - Premium UI components
- **Lucide React** - Icon library
- **Radix UI** - Headless UI primitives

### State & Data

- **React Context** - Global state (Auth)
- **Axios** - HTTP client
- **Custom Hooks** - Data fetching

### Code Quality

- **ESLint** - Code linting
- **TypeScript** - Type checking

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+
- Backend API running (see backend documentation)

### Installation

1. **Clone the repository**
   ```bash
   cd app/mateos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
   VITE_ENABLE_SIGNALR=true
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:5173
   ```

---

## 📁 Project Structure

```
mateos/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components (16+ components)
│   │   ├── Logo.tsx         # Brand logo
│   │   └── ProtectedRoute.tsx # Route guard
│   │
│   ├── pages/               # Page components
│   │   ├── public/          # Public pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── PricingPage.tsx
│   │   │   └── TeachersPage.tsx
│   │   ├── auth/            # Authentication pages
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   └── DashboardPage.tsx
│   │
│   ├── services/            # API services
│   │   ├── apiClient.ts     # Base HTTP client
│   │   ├── authService.ts
│   │   ├── subscriptionService.ts
│   │   ├── consultationService.ts
│   │   ├── familyService.ts
│   │   ├── teacherService.ts
│   │   └── groupService.ts
│   │
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication state
│   │
│   ├── hooks/               # Custom hooks
│   │   ├── useConsultations.ts
│   │   └── useSubscriptions.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── user.ts
│   │   ├── subscription.ts
│   │   ├── consultation.ts
│   │   ├── teacher.ts
│   │   ├── family.ts
│   │   ├── group.ts
│   │   └── index.ts
│   │
│   ├── lib/                 # Utilities
│   │   └── utils.ts
│   │
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
│
├── public/                  # Static assets
├── IMPLEMENTATION_SUGGESTIONS.md  # Implementation notes
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ✨ Features

### Implemented Features ✅

#### Public Pages
- ✅ **Landing Page** - Hero, features, testimonials, stats
- ✅ **Login Page** - Premium split-screen design
- ✅ **Register Page** - Multi-step registration with GDPR consent
- ✅ **Pricing Page** - Subscription plans with monthly/yearly toggle
- ✅ **Teachers Page** - Teacher marketplace with search

#### Protected Pages
- ✅ **Dashboard** - Role-based dashboard with statistics
- ✅ **Profile** - User profile management (basic structure)

#### Core Features
- ✅ JWT Authentication with auto-refresh
- ✅ Role-based access control (RBAC)
- ✅ Protected routes with loading states
- ✅ Responsive design (mobile-first)
- ✅ Premium UI with glass morphism effects
- ✅ Toast notifications (Sonner)

#### Services & API
- ✅ Complete API service layer
- ✅ Error handling with interceptors
- ✅ Token management
- ✅ Type-safe API calls

### Planned Features 🚧

- ⏳ Consultation management (calendar, booking)
- ⏳ Subscription checkout with Stripe
- ⏳ Parent-child relationship management
- ⏳ Teacher application process
- ⏳ Group management
- ⏳ Learning materials library
- ⏳ Admin dashboard and management
- ⏳ Real-time notifications with SignalR
- ⏳ Progress tracking and analytics

---

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Configured for React and TypeScript
- **Prettier** - Code formatting (recommended)

### Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add dropdown-menu
```

---

## 🏗️ Build & Deployment

### Production Build

```bash
npm run build
```

Output: `dist/` directory

### Environment Variables

Production environment requires:

```env
VITE_API_BASE_URL=https://api.mateos.ro/api
VITE_STRIPE_PUBLIC_KEY=pk_live_your_production_key
VITE_ENABLE_SIGNALR=true
```

### Deployment Checklist

- [ ] Set production API URL
- [ ] Add production Stripe keys
- [ ] Enable GZIP compression
- [ ] Configure CDN
- [ ] Add CSP headers
- [ ] Set up error tracking
- [ ] Add analytics

### Deploy to Netlify/Vercel

1. Connect repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

---

## 📚 Documentation

### Key Documents

- **[IMPLEMENTATION_SUGGESTIONS.md](./IMPLEMENTATION_SUGGESTIONS.md)** - Implementation notes for backend team
- **[implementation.md](../../implementation.md)** - Comprehensive architecture guide
- **shadcn/ui docs** - https://ui.shadcn.com

### API Documentation

The frontend expects the backend to provide:

- RESTful API endpoints
- JWT authentication
- Stripe/PayPal webhooks
- CORS enabled for frontend domain

See `IMPLEMENTATION_SUGGESTIONS.md` for detailed API requirements.

---

## 🎨 Design System

### Colors

```css
/* Primary Palette */
Primary: Blue (#3B82F6)
Secondary: Purple (#9333EA)

/* Gradients */
Primary gradient: from-primary to-purple-600
Background: from-background via-primary-50/20 to-purple-50/20

/* Effects */
Glass morphism: bg-white/50 backdrop-blur-sm
Hover: hover:shadow-lg transition-all
```

### Typography

```css
H1: text-5xl md:text-6xl font-extrabold
H2: text-4xl font-bold
H3: text-2xl font-bold
Body: text-base
Muted: text-muted-foreground
```

### Components

All UI components follow shadcn/ui v4 New York style with customizations.

---

## 🔒 Security

- JWT token management with auto-refresh
- CSRF token support
- XSS prevention with React
- CORS configuration
- Secure localStorage usage
- Role-based access control

---

## 🐛 Known Issues

See `IMPLEMENTATION_SUGGESTIONS.md` for current limitations and TODOs.

---

## 🤝 Contributing

This is a private project. For questions or suggestions, contact the backend team.

---

## 📄 License

Proprietary - Mateos Platform © 2025

---

## 📞 Support

For technical support:
- Review documentation
- Check implementation guides
- Contact backend team

---

**Built with ❤️ by the Mateos Team**

*Last Updated: October 21, 2025*

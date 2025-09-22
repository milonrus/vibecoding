# Not a Tourist - Coffee Shop with AI Chat

A modern Next.js application for "Not a Tourist" coffee shop in Budva, Montenegro, featuring:

- **Beautiful Landing Page** with interactive coffee bean animations
- **Firebase Authentication** (Google Sign-In + Email/Password)
- **Community Comments** with real-time likes and interactions
- **AI Coffee Consultant** powered by OpenAI GPT-3.5
- **Protected AI Chat** accessible only to signed-in users
- **Real-time Updates** using Firestore

## 🚀 Features

### 🏠 Landing Page
- Converted from original HTML with preserved animations
- Interactive coffee beans that respond to mouse movement
- Floating elements with parallax effects
- Steam particle animations
- Mobile-responsive design

### 🔐 Authentication
- Google Sign-In integration
- Email/password authentication
- Protected routes for AI chat
- Persistent authentication state

### 💬 Community Comments
- Real-time comment system at bottom of homepage
- Like/unlike functionality
- User avatars and timestamps
- Sign-in prompt for non-authenticated users

### 🤖 AI Coffee Consultant
- OpenAI-powered coffee expert chatbot
- Personalized coffee recommendations
- Knowledge about coffee origins, brewing methods, and local culture
- Chat history persistence per user
- Typing indicators and smooth UX

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **AI**: OpenAI GPT-3.5
- **Deployment**: Vercel-ready

## 🔧 Environment Setup

Create `.env.local` with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Firebase**:
   - Create a Firebase project
   - Enable Authentication (Google + Email/Password)
   - Create Firestore database
   - Deploy the security rules from `firestore.rules`

3. **Configure OpenAI**:
   - Get an OpenAI API key
   - Add it to your environment variables

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**: http://localhost:3000

## 📁 Project Structure

```
src/
├── app/
│   ├── api/chat/          # OpenAI chat API route
│   ├── chat/              # Protected AI chat page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── AuthModal.tsx      # Authentication modal
│   ├── CommentsSection.tsx # Community comments
│   └── Navigation.tsx     # Navigation bar
├── contexts/
│   └── AuthContext.tsx    # Firebase auth context
├── hooks/
│   └── useAuthModal.ts    # Auth modal state hook
└── lib/
    └── firebase.ts        # Firebase configuration
```

## 🔒 Security Rules

The app includes Firestore security rules that:
- Allow users to read all comments but only create/edit their own
- Restrict chat messages to the message owner
- Enable community like functionality

## 🎨 Animations & UX

- **Coffee Bean Physics**: Interactive coffee beans that respond to mouse movement
- **Parallax Effects**: Smooth floating animations for key elements
- **Steam Particles**: Subtle particle effects that follow cursor movement
- **Menu Hover Effects**: Beautiful shimmer animations on menu items
- **Smooth Transitions**: Consistent 0.3s ease transitions throughout
- **Typing Indicators**: Real-time feedback in AI chat
- **Loading States**: Proper loading indicators for all async operations

## 🌍 Deployment

The app is Vercel-ready and can be deployed with:

```bash
vercel
```

Make sure to add your environment variables in the Vercel dashboard.

## 🤝 Contributing

This is a custom implementation for "Not a Tourist" coffee shop. The codebase is designed to be maintainable and extensible for future features.

## ☕ About Not a Tourist

Located in the heart of Budva, Montenegro, "Not a Tourist" is more than just a coffee shop – it's a sanctuary for coffee enthusiasts who appreciate authentic specialty brewing and local culture.
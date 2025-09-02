# FeelWise - AI Emotion Analysis App

## Overview

FeelWise is a modern cross-platform emotion analysis application built with React/TypeScript frontend and Express.js backend. The app uses AI to analyze emotions through text or voice input and provides personalized recommendations including motivational quotes and music suggestions. It features a glassmorphism UI design with an animated character assistant named "Timori".

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom glassmorphism design system
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API with useReducer for app state
- **Animations**: Framer Motion for smooth UI transitions and character animations
- **Data Fetching**: TanStack Query (React Query) for server state management

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **AI Integration**: OpenAI GPT-4o for emotion analysis
- **Session Storage**: PostgreSQL-based session store (connect-pg-simple)

### Mobile-First Design
- Progressive Web App (PWA) capabilities with service worker
- Responsive design optimized for mobile devices
- Touch-friendly glassmorphism interface
- Offline functionality planning

## Key Components

### Frontend Components
1. **Pages**: Home, TextInput, VoiceInput, Result, History
2. **Core Components**: 
   - `TimoriCharacter`: Animated assistant with emotion-specific expressions
   - `GlassCard`: Reusable glassmorphism UI container
   - `LoadingOverlay`: Full-screen loading states
3. **Context Providers**:
   - `AppContext`: Global application state and emotion analysis logic
   - `ThemeContext`: Dark/light mode management
   - `I18nProvider`: Multi-language support (English, German, Persian)

### Backend Services
1. **Emotion Analysis Service**: OpenAI integration for text sentiment analysis
2. **Spotify Service**: Music recommendation engine using Spotify Web API with emotion-based parameters
3. **Storage Layer**: Abstracted storage interface with in-memory implementation
4. **API Routes**: RESTful endpoints for emotion analysis and history

### Database Schema
- **Users Table**: Basic user authentication (prepared for future use)
- **Emotion Analyses Table**: Stores analysis results with metadata
  - Input text/type, detected emotion, confidence, intensity
  - Generated quotes and music recommendations
  - Timestamps for history tracking

## Data Flow

1. **Input Collection**: Users provide text input or voice recordings (voice converts to text)
2. **AI Analysis**: Text sent to OpenAI API for emotion detection and confidence scoring
3. **Music Discovery**: Spotify API provides personalized track recommendations using emotion-based audio feature parameters
4. **Result Generation**: AI provides emotion classification, motivational quotes, and curated music playlists
5. **Data Persistence**: Analysis results with Spotify track metadata stored in PostgreSQL database
6. **History Management**: Users can view past analyses with Timori character representations and music recommendations

## External Dependencies

### AI & Cloud Services
- **OpenAI API**: GPT-4o model for emotion analysis and content generation
- **Spotify Web API**: Client Credentials flow for music recommendations based on detected emotions
- **Neon Database**: Serverless PostgreSQL hosting
- **Web Speech API**: Planned for voice input transcription (currently simulated)

### Frontend Libraries
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animation library for smooth transitions
- **TanStack Query**: Server state management and caching
- **date-fns**: Date formatting and manipulation
- **Wouter**: Lightweight routing solution

### Development Tools
- **Drizzle Kit**: Database schema migration and management
- **TypeScript**: Type safety across the entire application
- **Tailwind CSS**: Utility-first styling framework
- **Vite**: Fast build tool with HMR support

## Deployment Strategy

### Development Setup
- **Hot Module Replacement**: Vite development server with Express backend proxy
- **Environment Variables**: OpenAI API key and database URL configuration
- **Database Migrations**: Drizzle Kit for schema management

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles Node.js server for deployment
- **Database**: Automatic PostgreSQL schema deployment via Drizzle

### Progressive Web App Features
- **Service Worker**: Offline caching for core functionality
- **Web Manifest**: App installation capabilities
- **Push Notifications**: Prepared infrastructure for engagement features

### Internationalization
- **Multi-language Support**: English, German, and Persian (Farsi)
- **Font Strategy**: Vazir font for Persian content, Inter for Latin scripts
- **RTL Support**: Prepared for right-to-left text direction

## Recent Changes (January 2025)

✓ **Spotify Integration Completed**: Real music recommendations now working with authentic Spotify Web API
- Implemented emotion-based search queries instead of recommendations endpoint
- Added emotion-specific music parameters (valence, energy, tempo, etc.)
- Successfully tested with all emotion types (Happy, Sad, Angry, Calm, etc.)

✓ **Timori Character Updates**: New custom emotion-specific character images integrated
- Replaced stock images with custom designed Timori characters
- Added support for all emotion states: happy, sad, angry, anxious, excited, calm
- Improved visual consistency with glassmorphism design

✓ **Technical Improvements**: 
- Fixed React state update warnings in Result component
- Enhanced error handling for Spotify API authentication
- Improved TypeScript type safety for Spotify tracks

The application follows a modern full-stack architecture with emphasis on user experience, accessibility, and scalability. The glassmorphism design system creates an engaging visual experience while maintaining functionality across devices.
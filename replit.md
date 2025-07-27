# VoidRiders: Dogfight Arena

## Overview

VoidRiders is a 3D browser-based multiplayer spaceship combat game built on React with Three.js for 3D graphics. The project features real-time dogfights between players piloting NFT-backed spaceships, with a full-stack architecture using Express.js on the backend and PostgreSQL with Drizzle ORM for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared components:

- **Frontend**: React + Three.js client built with Vite
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM
- **Build System**: TypeScript with ESM modules
- **Styling**: TailwindCSS with Radix UI components

### Directory Structure
```
/
├── client/          # React frontend with Three.js
├── server/          # Express.js backend
├── shared/          # Shared schemas and types
├── migrations/      # Database migration files
└── config files     # Build and configuration files
```

## Key Components

### Frontend Architecture
- **React 18** with modern hooks and functional components
- **Three.js via @react-three/fiber** for 3D rendering
- **@react-three/drei** for 3D utilities and helpers
- **TailwindCSS** with Radix UI component library
- **TanStack Query** for API state management
- **Zustand** for client-side state management

### Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with structured routing
- **WebSocket support** for real-time multiplayer features
- **Memory storage** with interface for easy database migration

### Game Engine
- **3D spaceship controls** with keyboard input handling
- **Physics simulation** with collision detection
- **Real-time multiplayer** via WebSocket connections
- **Game state management** with lobby, playing, and ended phases

## Data Flow

1. **Client Authentication**: Users connect through the lobby system
2. **Game Matching**: Players select spaceships and join matches
3. **Real-time Communication**: WebSocket connections handle game state synchronization
4. **3D Rendering**: Three.js renders spaceships, environments, and effects
5. **State Management**: Zustand manages client state, TanStack Query handles server state

### API Endpoints
- `GET /api/game/status` - Game server status and player count
- `GET /api/game/leaderboard` - Player rankings and scores
- `GET /api/spaceships` - Available NFT spaceships

### WebSocket Events
- Player position/rotation updates
- Laser firing and collision detection
- Health and damage notifications
- Match start/end events

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless** - PostgreSQL database driver
- **drizzle-orm** - Type-safe database ORM
- **@radix-ui/*** - Accessible UI component primitives
- **@react-three/*** - 3D graphics and utilities
- **ws** - WebSocket implementation for real-time features

### Development Tools
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety and development experience
- **ESBuild** - Fast bundling for production
- **TailwindCSS** - Utility-first CSS framework

## Deployment Strategy

The application is configured for modern deployment platforms:

### Build Process
1. **Frontend**: Vite builds optimized client bundle to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle generates migrations to `migrations/` directory

### Environment Configuration
- **DATABASE_URL** - PostgreSQL connection string (required)
- **NODE_ENV** - Environment flag for production optimizations

### Scripts
- `npm run dev` - Development server with hot reloading
- `npm run build` - Production build for both client and server
- `npm run start` - Production server startup
- `npm run db:push` - Database schema synchronization

The architecture supports both development and production environments with automatic Vite middleware in development and static file serving in production.
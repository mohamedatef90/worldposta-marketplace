# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **WorldPosta Marketplace** application - an Angular-based marketplace for virtual machines and cloud applications. The project uses Angular 20 with a hybrid setup that includes both Angular CLI configuration and Vite for development, along with TailwindCSS for styling.

## Key Commands

### Development
- `npm run dev` - Start the development server using Angular serve
- `npm run build` - Build the application for production
- `npm run preview` - Serve the production build for preview

### Environment Setup
- Set `GEMINI_API_KEY` in `.env.local` before running the application
- The app is designed to run with AI Studio integration

## Architecture

### File Structure
```
src/
├── app.component.ts          # Main app component with header/footer layout
├── app.routes.ts            # Route configuration for all pages
├── models/
│   └── marketplace.model.ts  # TypeScript interfaces for marketplace data
├── services/
│   ├── marketplace.service.ts # Core business logic and data
│   └── auth.service.ts       # Simple authentication state management
├── components/              # Feature components
│   ├── marketplace/         # Main marketplace listing page
│   ├── configure/          # VM configuration page
│   ├── all-market-apps/    # Category listing page
│   ├── payment/            # Payment processing
│   ├── register/           # User registration
│   ├── docs/               # Documentation page
│   ├── header/             # Navigation header
│   ├── footer/             # Site footer
│   ├── not-found/          # 404 page
│   └── lottie-player/      # Animation component
└── assets/
    └── cloud-animation.data.ts # Animation data
```

### Key Technologies
- **Angular 20** with standalone components
- **RxJS** for reactive programming
- **TailwindCSS** for styling (referenced but config not present)
- **Angular Router** with hash location strategy
- **Zoneless change detection** for performance
- **TypeScript 5.8** with ES2022 target

### Data Architecture
The application centers around two main models:
- `MarketplaceItem` - VM/application listings with pricing, categories, ratings
- `Category` - Organization structure for marketplace items

The `MarketplaceService` contains static data for 60+ marketplace items across categories like:
- CMS & Publishing (WordPress, Drupal, Ghost)
- E-commerce (WooCommerce, Magento, PrestaShop)  
- Automation & Integration (n8n, Node-RED, Apache Airflow)
- LLM & AI (Llama 3.1, Ollama, TensorFlow)
- Operating Systems (Ubuntu, Windows Server, RHEL)
- Design & Creative Tools (Adobe Creative Suite, Blender)

### Routing Structure
- `/` - Main marketplace page
- `/configure/:id` - VM configuration for specific item
- `/category/:id` - Items filtered by category
- `/docs` - Documentation
- `/register` - User registration
- `/payment` - Payment processing
- `/**` - 404 not found page

### Component Patterns
- All components use **standalone components** pattern
- **OnPush change detection** for performance
- **Signal-based** authentication state in AuthService
- Components follow feature-based organization

## Development Notes

- The app uses a unique hybrid setup with Angular CLI (`angular.json`) but references a Vite build process
- Entry point is `index.tsx` (unusual for Angular, typically `main.ts`)
- Uses hash-based routing (`withHashLocation()`)
- No traditional testing, linting, or TypeScript checking scripts are configured
- TailwindCSS is included as dependency but no config file present
- Environment variables should be set in `.env.local`

## Important Considerations

- This appears to be an AI Studio generated application based on the README
- The pricing model is sophisticated with base costs plus per-GB storage/RAM/bandwidth
- All marketplace data is static and embedded in the service (no external APIs)
- Authentication is basic (boolean state only)
- No backend integration present - this is a frontend-only application
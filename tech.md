# Tech Stack Documentation

## Project Overview
- **Name**: deathmattertools-ai
- **Version**: 0.1.0
- **Package Manager**: pnpm@10.15.0

## Core Framework & Runtime
- **Next.js**: 15.5.2 (App Router with Turbopack)
- **React**: 19.1.0
- **React DOM**: 19.1.0
- **TypeScript**: 5.9.2
- **Node.js**: Compatible with @types/node 20.19.11

## Database & ORM
- **ORM**: Drizzle ORM 0.44.5
- **Database**: Neon Database (@neondatabase/serverless 1.0.1)
- **Database Tools**: drizzle-kit 0.31.4

## Authentication
- **Auth Provider**: Clerk 6.31.6
- **Clerk Themes**: 2.4.15

## AI & Machine Learning
- **AI SDK Core**: ai 5.0.26
- **AI SDK React**: @ai-sdk/react 2.0.26
- **AI Providers**:
  - Anthropic: @ai-sdk/anthropic 2.0.8
  - OpenAI: @ai-sdk/openai 2.0.22 + openai 5.16.0
  - OpenRouter: @openrouter/ai-sdk-provider 1.1.2

## Styling & UI
- **CSS Framework**: Tailwind CSS 4.1.12
- **PostCSS**: @tailwindcss/postcss 4.1.12
- **Component Utilities**:
  - class-variance-authority 0.7.1
  - clsx 2.1.1
  - tailwind-merge 3.3.1
  - tw-animate-css 1.3.7
- **UI Components**:
  - Radix UI 1.4.3
  - Lucide React 0.525.0 (icons)
  - @iconify/react 6.0.0 (icons)
- **Animation**: Motion 12.23.12
- **Theme Management**: next-themes 0.4.6

## State Management & Data Fetching
- **State Management**: Jotai 2.13.1
- **Data Fetching**: SWR 2.3.6

## File Upload & Media
- **File Upload**: UploadThing 7.7.4 + @uploadthing/react 7.3.3
- **File Handling**: react-dropzone 14.3.8
- **Image Processing**: react-image-crop 11.0.10

## Form & Input Components
- **OTP Input**: input-otp 1.4.2
- **Date Picker**: react-day-picker 9.9.0

## Utilities & Tools
- **Date Handling**: date-fns 4.1.0
- **Environment Variables**: @t3-oss/env-nextjs 0.13.8
- **Email Components**: @react-email/components 0.5.1
- **Email Service**: Resend 6.0.1
- **Notifications**: Sonner 2.0.7
- **Schema Validation**: Zod 4.1.3
- **Configuration**: dotenv 17.2.1
- **Server-only Code**: server-only 0.0.1

## Security & Rate Limiting
- **Security**: Arcjet (@arcjet/next 1.0.0-beta.10, @arcjet/inspect 1.0.0-beta.10)

## Development & Build Tools
- **React Compiler**: babel-plugin-react-compiler 19.1.0-rc.2 (experimental)
- **Build Tool**: Turbopack (integrated with Next.js)

## Development Scripts
```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production with Turbopack
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm db:push          # Push schema changes
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio
```

## Key Architecture Notes

### Next.js Configuration
- Using **App Router** (Next.js 13+ pattern)
- **Turbopack** enabled for faster builds and development
- React 19.1.0 with latest features

### Database Strategy
- **Drizzle ORM** with **Neon Database** (serverless PostgreSQL)
- Type-safe database operations
- Migration-based schema management

### Authentication Pattern
- **Clerk** for user authentication and management
- Integrated with Next.js App Router middleware

### AI Integration
- Multi-provider AI setup (Anthropic, OpenAI, OpenRouter)
- React hooks for AI interactions
- Vercel AI SDK for consistent API

### Styling Approach
- **Tailwind CSS v4** (latest version)
- Component-based architecture with class variance authority
- Radix UI for accessible base components
- Custom animation system with Motion

### State Management
- **Jotai** for atomic state management
- **SWR** for server state synchronization
- React 19's built-in state management features

## AI Assistant Guidelines

### Preferred Patterns
- Use **TypeScript** with strict typing (avoid `any`)
- Follow **Next.js App Router** patterns with `app/` directory
- Use **server actions** for data mutations
- Implement **Drizzle ORM** for database operations
- Use **Clerk** authentication patterns from latest docs
- Apply **Tailwind CSS v4** for styling
- Use **Zod** for input validation

### Component Guidelines
- Create **const** components instead of function declarations
- Use **named exports** for components
- Follow **snake-case** for component file names
- Implement **composable patterns**
- Use **custom hooks** for shared logic
- Apply **useMemo** and **useCallback** for optimization

### Database Guidelines
- Use **Drizzle ORM** with type-safe queries
- Apply **server-only** for database operations
- Use **React cache** for memoizing database calls
- Follow migration-based schema updates

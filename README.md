# Pneuma Full-Stack Engineer Assignment

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with bcryptjs
- **File Storage**: AWS S3 compatible (Cloudflare R2)
- **UI Components**: Radix UI, Lucide React
- **Forms**: React Hook Form with Zod validation
- **Tables**: TanStack Table
- **Styling**: Tailwind CSS with custom components

## Project Structure

This is a Next.js application with a clean architecture. The main folders are:

- `prisma/` - Database schema, migrations, and seed data.
- `src/app/` - Pages and API routes.
- `src/components/` - Reusable UI components.
- `src/hooks/` - Custom React hooks for state management.
- `src/lib/` - Utility functions and configurations.
- `src/repositories/` - Database access layer.
- `src/services/` - Business logic.
- `src/types/` - TypeScript type definitions.

## Getting Started

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=

# Environment
NODE_ENV=development

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"

# Cloudflare R2 Storage
CLOUDFLARE_R2_ENDPOINT=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
```

### Installation & Setup

1. **Clone and install dependencies**

```bash
 git clone https://github.com/iamNilotpal/pneuma-fse-assignment.git
 cd pneuma-fse-assignment
 npm install
```

2. **Set up the database**

```bash
 # Create initial migration
 npm run migration:create:only

 # Deploy migrations to database
 npm run migrate:prod

 # Generate Prisma client
 npm run prisma:generate

 # Seed the database with sample data
 npm run db:seed
```

3. **Start the development server**

```bash
 npm run dev
```

4. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Sign up for a new account or use seeded credentials

## Available Scripts

```bash
# Development
npm run dev             # Start development server with turbopack.

# Production
npm run build           # Build for production (includes Prisma generate).
npm start               # Start production server.

# Database
npm run db:seed         # Seed database with sample data.
npm run prisma:studio   # Open Prisma Studio (database GUI).
npm run migrate:prod    # Deploy migrations to production.

# Code Quality
npm run lint            # Run ESLint
```

## Architecture Highlights

### Repository Pattern

Clean separation of data access logic with dedicated repository classes for each
entity.

### Service Layer

Business logic encapsulated in service classes, promoting reusability and
testability.

### Type Safety

Comprehensive TypeScript implementation with Zod schemas for runtime validation.

### Component Architecture

Modular React components with clear separation of concerns and reusable UI
elements.

## Database Schema

The application uses a PostgreSQL database with the following main entities:

- **Users**: Authentication and user management
- **FrequentFlyerPrograms**: FFP details with logos and status
- **CreditCards**: Credit card partner information
- **TransferRatios**: Many-to-many relationship with ratio values

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

```
pneuma-fse-assignment/
│
├── Database & Migrations
│   └── prisma/
│       ├── migrations/         # Database migration files
│       ├── schema.prisma       # Database schema definition
│       └── seed.ts            # Database seeding script
│
└── Source Code
    └── src/
        ├── API Routes
        │   └── app/api/
        │       ├── auth/[...nextauth]/  # Authentication endpoints
        │       ├── credit-cards/        # Credit card CRUD operations
        │       ├── programs/            # FFP CRUD operations
        │       ├── transfer-ratios/     # Transfer ratio management
        │       └── upload/              # File upload endpoint
        │
        ├── Application Pages
        │   └── app/
        │       ├── (auth)/             # Authentication pages
        │       │   ├── signin/         # Sign-in page
        │       │   └── signup/         # Sign-up page
        │       ├── error.tsx           # Error boundary
        │       ├── favicon.ico         # Site favicon
        │       ├── globals.css         # Global styles
        │       ├── layout.tsx          # Root layout
        │       ├── loading.tsx         # Loading component
        │       └── page.tsx            # Dashboard/main page
        │
        ├── Reusable Components
        │   └── components/
        │       ├── forms/              # Form components
        │       │   ├── auth/           # Authentication forms
        │       │   └── programs/       # Program management forms
        │       ├── programs/           # Program-specific components
        │       ├── tables/             # Table components
        │       └── ui/                 # Base UI components (Radix UI)
        │
        ├── Custom Hooks
        │   └── hooks/
        │       ├── use-dashboard-actions.ts    # Dashboard state management
        │       ├── use-file-upload.ts          # File upload logic
        │       ├── use-programs-api.ts         # Program API calls
        │       ├── use-programs-state.ts       # Program state management
        │       └── use-transfer-ratios.ts      # Transfer ratio management
        │
        ├── Core Libraries
        │   └── lib/
        │       ├── auth.ts             # Authentication configuration
        │       ├── prisma.ts           # Database client
        │       ├── response.ts         # API response utilities
        │       ├── schemas/            # Zod validation schemas
        │       ├── utils.ts            # Utility functions
        │       └── validation.ts       # Form validation helpers
        │
        ├── Data Layer
        │   ├── repositories/           # Data access layer
        │   │   ├── credit-card.repository.ts
        │   │   ├── program.repository.ts
        │   │   └── transfer-ratio.repository.ts
        │   └── services/               # Business logic layer
        │       ├── credit-card.service.ts
        │       ├── program.service.ts
        │       ├── transfer-ratio.service.ts
        │       └── upload.service.ts
        │
        └── Type Definitions
            └── types/
                ├── card.ts             # Credit card types
                ├── program.ts          # FFP types
                ├── ratio.ts            # Transfer ratio types
                ├── response.ts         # API response types
                ├── upload.ts           # File upload types
                └── user.ts             # User types
```

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
 git clone <repository-url>
 cd pneuma-fse-assignment
 npm install
```

2. **Set up the database**

```bash
 # Generate Prisma client
 npx prisma generate

 # Run database migrations
 npx prisma migrate deploy

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
npm run dev             # Start development server with turbopack

# Production
npm run build           # Build for production (includes Prisma generate)
npm start               # Start production server

# Database
npm run db:seed         # Seed database with sample data
npm run prisma:studio   # Open Prisma Studio (database GUI)
npm run migrate:prod    # Deploy migrations to production

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

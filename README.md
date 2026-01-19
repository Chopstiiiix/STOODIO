# Studio BnB - Airbnb Clone

A full-stack vacation rental platform built with Next.js 15, TypeScript, Prisma, and PostgreSQL.

## Features

### Core Features
- **Authentication System**: Secure user authentication with NextAuth.js
  - Email/Password authentication
  - Google OAuth integration
  - GitHub OAuth integration
- **Property Listings**: Browse and view detailed property information
- **Advanced Search & Filters**: Comprehensive search with multiple criteria
  - Location-based search
  - Price range filtering
  - Category filtering (Music, Podcast, Photo, Makeup studios)
  - Guest count, rooms, and bathroom filters
- **Booking System**: Reserve properties with an interactive calendar
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### New Features

#### 1. Image Management
- Multi-image upload with drag & drop (up to 10 images per property)
- Image gallery with lightbox viewer
- Automatic cover photo selection
- Powered by UploadThing

#### 2. User Profiles
- Public user profile pages
- Profile editing with image upload
- User type selection (Host/Guest)
- Studio type specification for hosts
- View user listings and statistics

#### 3. Reviews & Ratings
- 5-star rating system
- Written reviews with validation
- Average ratings displayed on property cards
- Only verified guests (completed bookings) can review
- Prevent duplicate reviews

#### 4. Enhanced Host Dashboard
- Comprehensive analytics overview
- Revenue tracking (total and pending)
- Booking statistics by status
- Recent bookings and reviews
- Dedicated bookings management page

#### 5. Interactive Maps
- Mapbox integration for location display
- Interactive location picker for property creation
- Search locations by address
- Property markers on map view

#### 6. Email Notifications
- Automated booking confirmations
- Host booking notifications
- Cancellation emails
- Booking reminders
- Professional HTML email templates
- Powered by Resend

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Authentication**: NextAuth.js v4 with OAuth (Google, GitHub)
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns, react-day-picker
- **Notifications**: react-hot-toast
- **Image Upload**: UploadThing
- **Maps**: Mapbox GL JS, react-map-gl
- **Email Service**: Resend
- **Payments**: Stripe (with Connect for host payouts)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or use Prisma's local database)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up your environment variables:

The `.env` file already contains a local Prisma Postgres configuration. To use it:

```bash
# Start local Prisma Postgres (optional)
npx prisma dev
```

Or update the `DATABASE_URL` in `.env` with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

3. Generate Prisma Client:

```bash
npx prisma generate
```

4. Run database migrations:

```bash
npx prisma db push
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main models:

- **User**: User accounts with authentication
- **Property**: Property listings with details
- **Booking**: Reservations linking users and properties
- **Review**: Property reviews (schema ready)

## Project Structure

```
studio-bnb/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── properties/        # Property pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── navbar/           # Navigation components
│   ├── modals/           # Modal dialogs
│   ├── inputs/           # Form inputs
│   └── listings/         # Property listing components
├── actions/              # Server actions
├── lib/                  # Utility libraries
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── utils/                # Helper functions
└── prisma/               # Database schema
```

## Environment Variables

Required environment variables in `.env`:

```env
# Database
DATABASE_URL="your-postgres-connection-string"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# UploadThing (for image uploads)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Stripe (for payments)
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Resend (for emails)
RESEND_API_KEY="your-resend-api-key"

# Mapbox (for maps)
NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-public-token"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

See `SETUP_GUIDE.md` for detailed configuration instructions.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features in Detail

### Authentication

- Secure credential-based authentication
- Protected routes and API endpoints
- Session management with JWT

### Property Management

- Create and list properties
- Upload property images
- Set pricing and availability
- Categorize properties

### Search & Filtering

- Filter by category (Beach, Modern, Countryside, etc.)
- Filter by guest count, rooms, and bathrooms
- Location-based search

### Booking System

- Interactive calendar with date selection
- Automatic price calculation
- Prevent double-booking
- View booking history

## Completed Enhancements ✅

- ✅ Image upload functionality (UploadThing)
- ✅ User profiles with editing
- ✅ Reviews and ratings system
- ✅ Enhanced property management dashboard
- ✅ Advanced search with filters
- ✅ Interactive maps (Mapbox)
- ✅ Email notifications (Resend)
- ✅ Social authentication (Google, GitHub)

## Future Enhancements

- Automated booking reminder cron jobs
- Real-time messaging between hosts and guests
- Wishlist/Favorites functionality
- Property availability calendar improvements
- Additional payment methods
- Mobile application (React Native)
- SEO optimization
- Property analytics for hosts
- Advanced revenue reports
- Multi-language support

## License

This project is open source and available under the MIT License.

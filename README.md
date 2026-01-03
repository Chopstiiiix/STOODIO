# Studio BnB - Airbnb Clone

A full-stack vacation rental platform built with Next.js 15, TypeScript, Prisma, and PostgreSQL.

## Features

- **Authentication System**: Secure user authentication with NextAuth.js
- **Property Listings**: Browse and view detailed property information
- **Search & Filters**: Filter properties by category, location, and amenities
- **Booking System**: Reserve properties with an interactive calendar
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Date Picker**: react-day-picker
- **Notifications**: react-hot-toast

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
DATABASE_URL="your-postgres-connection-string"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure secret:

```bash
openssl rand -base64 32
```

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

## Future Enhancements

- Image upload functionality
- User profiles and reviews
- Payment integration (Stripe)
- Property management dashboard
- Advanced search with maps
- Email notifications
- Social authentication (Google, GitHub)

## License

This project is open source and available under the MIT License.

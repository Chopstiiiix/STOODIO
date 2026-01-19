# STOODIO - Complete Setup Guide

All requested features have been successfully implemented! This guide will help you configure and run your enhanced STOODIO platform.

## Features Implemented

### 1. Image Upload System ✅
- Multi-image upload with UploadThing
- Image gallery with lightbox
- Drag & drop support
- Cover photo selection
- Property image management API

### 2. User Profiles ✅
- User profile pages
- Profile editing with image upload
- User type selection (Host/Guest)
- Studio type specification
- Public profile views

### 3. Reviews System ✅
- 5-star rating system
- Review submission (only for completed bookings)
- Review display with user info
- Average ratings on property cards
- Prevent duplicate reviews

### 4. Enhanced Host Dashboard ✅
- Analytics overview (revenue, bookings, ratings)
- Recent bookings display
- Recent reviews
- Property statistics
- Bookings management page

### 5. Advanced Search ✅
- Location-based search
- Category filtering
- Price range filtering
- Guest/room/bathroom filters
- Search results page with ratings

### 6. Mapbox Integration ✅
- Interactive maps for location display
- Location picker for property creation
- Map search functionality
- Property markers

### 7. Email Notifications ✅
- Resend integration
- Booking confirmation emails
- Host notification emails
- Cancellation emails
- Booking reminder emails

### 8. OAuth Authentication ✅
- Google Sign-In
- GitHub Sign-In
- Integrated with existing credentials auth

## Setup Instructions

### 1. Environment Variables

Update your `.env` file with the following credentials:

```env
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/stoodio?schema=public"

# NextAuth (Required)
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# UploadThing (Required for image uploads)
# Sign up at https://uploadthing.com
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"

# Stripe (Required for payments)
# Get from https://stripe.com
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend (Required for emails)
# Sign up at https://resend.com
RESEND_API_KEY="re_..."

# Mapbox (Required for maps)
# Sign up at https://mapbox.com
NEXT_PUBLIC_MAPBOX_TOKEN="pk...."

# Google OAuth (Optional)
# Get from https://console.cloud.google.com
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# GitHub OAuth (Optional)
# Get from https://github.com/settings/developers
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
```

### 2. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

### 3. Install Dependencies

All required packages have been installed:
- `uploadthing` & `@uploadthing/react` - Image uploads
- `mapbox-gl` & `react-map-gl` - Maps
- `resend` - Email service
- `date-fns` - Date formatting
- `query-string` - URL query handling

### 4. Service Configuration

#### UploadThing Setup
1. Visit [uploadthing.com](https://uploadthing.com)
2. Create an account and app
3. Copy your Secret and App ID
4. Add to `.env` file

#### Resend Setup
1. Visit [resend.com](https://resend.com)
2. Create account and verify domain
3. Generate API key
4. Add to `.env` file
5. Update `from` email in `lib/email.ts` to match your verified domain

#### Mapbox Setup
1. Visit [mapbox.com](https://mapbox.com)
2. Create account
3. Copy your default public token
4. Add to `.env` file as `NEXT_PUBLIC_MAPBOX_TOKEN`

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret

#### GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create New OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and generate Client Secret

### 5. Run the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## New Features Guide

### Image Upload
- Navigate to any property edit page
- Use the drag & drop zone or click to upload
- First image becomes cover photo
- Maximum 10 images per property

### User Profiles
- Click on any user name to view their profile
- Edit your profile from the user menu
- Upload profile picture
- Set user type and studio type

### Reviews
- Complete a booking to unlock review access
- Visit the property page
- Submit rating (1-5 stars) and comment
- Reviews appear on property pages and search results

### Host Dashboard
- Access from `/dashboard/host`
- View analytics, revenue, and statistics
- Manage bookings from `/dashboard/host/bookings`
- Create and edit listings

### Advanced Search
- Click the search button in navigation
- Set filters for location, price, category
- Filter by guest count, rooms, bathrooms
- View results with ratings

### Maps
- Use location picker when creating properties
- Search for locations or click on map
- View property locations on detail pages

### Email Notifications
Automatic emails are sent for:
- Booking confirmations
- Host notifications
- Booking cancellations
- Booking reminders (implement cron job for automation)

### OAuth Sign-In
- Click "Login" from navigation
- Choose Google or GitHub
- Authorize and redirect back
- Account created automatically

## File Structure

```
stoodio/
├── app/
│   ├── api/
│   │   ├── uploadthing/          # Image upload API
│   │   ├── user/profile/         # User profile API
│   │   ├── properties/[id]/      # Property APIs
│   │   │   ├── reviews/          # Reviews API
│   │   │   └── images/           # Property images API
│   │   └── listings/             # Listings management
│   ├── dashboard/
│   │   └── host/                 # Host dashboard
│   │       ├── page.tsx          # Analytics dashboard
│   │       ├── bookings/         # Bookings management
│   │       └── listings/         # Listings CRUD
│   ├── profile/                  # User profiles
│   ├── properties/               # Property detail pages
│   └── search/                   # Search results
├── components/
│   ├── inputs/
│   │   └── ImageUpload.tsx       # Image uploader
│   ├── listings/
│   │   ├── PropertyImageGallery.tsx  # Image gallery
│   │   └── PropertyCard.tsx          # Enhanced card with ratings
│   ├── map/
│   │   ├── Map.tsx               # Mapbox integration
│   │   └── LocationPicker.tsx    # Location selection
│   ├── reviews/
│   │   ├── ReviewsList.tsx       # Display reviews
│   │   └── ReviewForm.tsx        # Submit reviews
│   ├── search/
│   │   └── AdvancedSearch.tsx    # Search modal
│   └── modals/
│       └── LoginModal.tsx        # Enhanced with OAuth
├── lib/
│   ├── email.ts                  # Email service & templates
│   ├── auth.ts                   # Auth config with OAuth
│   └── uploadthing.ts            # UploadThing config
└── prisma/
    └── schema.prisma             # Updated with PropertyImage model
```

## Troubleshooting

### Image Upload Issues
- Check UploadThing credentials
- Verify file size limits (max 4MB)
- Check browser console for errors

### Email Not Sending
- Verify Resend API key
- Check domain verification
- Update `from` email in `lib/email.ts`

### Maps Not Loading
- Verify Mapbox token is public (starts with `pk.`)
- Check token is set as `NEXT_PUBLIC_MAPBOX_TOKEN`
- Ensure token has correct permissions

### OAuth Not Working
- Verify callback URLs match exactly
- Check client IDs and secrets
- Ensure OAuth apps are not restricted

### Database Errors
- Run `npx prisma generate` after schema changes
- Push changes with `npx prisma db push`
- Check PostgreSQL connection

## Production Deployment

Before deploying to production:

1. Generate a secure `NEXTAUTH_SECRET`
2. Update all callback URLs to production domain
3. Update `NEXTAUTH_URL` to production URL
4. Verify domain in Resend
5. Set up proper database backups
6. Configure Stripe webhooks for production
7. Enable rate limiting on API routes
8. Set up monitoring and error tracking

## Support

For issues or questions:
- Check the documentation in each component
- Review the API routes for implementation details
- Consult service provider docs (UploadThing, Resend, Mapbox)

## Next Steps

Recommended enhancements:
1. Implement booking reminder cron job
2. Add property availability calendar
3. Implement wishlist/favorites
4. Add more payment methods
5. Create mobile app
6. Add real-time chat
7. Implement property analytics for hosts
8. Add SEO optimization

---

Built with Next.js 15, TypeScript, Prisma, and PostgreSQL

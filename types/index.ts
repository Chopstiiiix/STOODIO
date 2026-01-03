import { User, Property, Booking, Review } from "@prisma/client";

export type SafeUser = Omit<User, "createdAt" | "updatedAt" | "emailVerified"> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type SafeProperty = Omit<Property, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type SafeBooking = Omit<Booking, "createdAt" | "startDate" | "endDate"> & {
  createdAt: string;
  startDate: string;
  endDate: string;
};

export type SafeReview = Omit<Review, "createdAt"> & {
  createdAt: string;
  user: SafeUser;
};

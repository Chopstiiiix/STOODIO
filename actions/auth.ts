"use server";

import bcrypt from "bcryptjs";
import prismadb from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function registerUser(data: {
  email: string;
  name: string;
  password: string;
  userType: string;
  studioType?: string;
}) {
  try {
    const { email, name, password, userType, studioType } = data;

    const existingUser = await prismadb.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        userType,
        studioType: userType === "host" ? studioType : null,
      },
    });

    return { success: true, user: { id: user.id, email: user.email } };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prismadb.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    };
  } catch (error) {
    return null;
  }
}

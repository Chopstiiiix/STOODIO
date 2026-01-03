import prismadb from "@/lib/prisma";

/**
 * Get availability rules and exceptions for a property
 */
export async function getPropertyAvailability(propertyId: string) {
  const [weeklyRules, exceptions] = await Promise.all([
    prismadb.availability.findMany({
      where: { propertyId },
      orderBy: { dayOfWeek: "asc" },
    }),
    prismadb.availabilityException.findMany({
      where: { propertyId },
      orderBy: { startTime: "asc" },
    }),
  ]);

  return {
    weeklyRules: weeklyRules.map((rule) => ({
      ...rule,
      createdAt: rule.createdAt.toISOString(),
      updatedAt: rule.updatedAt.toISOString(),
    })),
    exceptions: exceptions.map((exception) => ({
      ...exception,
      startTime: exception.startTime.toISOString(),
      endTime: exception.endTime.toISOString(),
      createdAt: exception.createdAt.toISOString(),
      updatedAt: exception.updatedAt.toISOString(),
    })),
  };
}

/**
 * Verify that the current user owns the property
 */
export async function verifyPropertyOwnership(
  propertyId: string,
  userId: string
): Promise<boolean> {
  const property = await prismadb.property.findUnique({
    where: { id: propertyId },
    select: { userId: true },
  });

  return property?.userId === userId;
}

/**
 * Replace all weekly availability rules for a property
 */
export async function replaceWeeklyAvailability(
  propertyId: string,
  rules: Array<{ dayOfWeek: number; startTime: string; endTime: string }>
) {
  // Delete existing rules and create new ones in a transaction
  await prismadb.$transaction([
    prismadb.availability.deleteMany({
      where: { propertyId },
    }),
    ...rules.map((rule) =>
      prismadb.availability.create({
        data: {
          propertyId,
          dayOfWeek: rule.dayOfWeek,
          startTime: rule.startTime,
          endTime: rule.endTime,
        },
      })
    ),
  ]);

  return getPropertyAvailability(propertyId);
}

/**
 * Create an availability exception (blocked time range)
 */
export async function createAvailabilityException(
  propertyId: string,
  data: {
    startTime: Date;
    endTime: Date;
    reason?: string;
  }
) {
  const exception = await prismadb.availabilityException.create({
    data: {
      propertyId,
      startTime: data.startTime,
      endTime: data.endTime,
      reason: data.reason,
    },
  });

  return {
    ...exception,
    startTime: exception.startTime.toISOString(),
    endTime: exception.endTime.toISOString(),
    createdAt: exception.createdAt.toISOString(),
    updatedAt: exception.updatedAt.toISOString(),
  };
}

/**
 * Delete an availability exception
 */
export async function deleteAvailabilityException(exceptionId: string) {
  await prismadb.availabilityException.delete({
    where: { id: exceptionId },
  });
}

/**
 * Validate time format (HH:MM)
 */
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Validate that endTime is after startTime
 */
export function isValidTimeRange(startTime: string, endTime: string): boolean {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  return endMinutes > startMinutes;
}

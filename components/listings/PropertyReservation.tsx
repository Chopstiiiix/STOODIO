"use client";

import { useState, useEffect, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import { differenceInDays, eachDayOfInterval } from "date-fns";
import Calendar from "../inputs/Calendar";
import Button from "../Button";
import { SafeBooking } from "@/types";
import { createBooking } from "@/actions/bookings";
import { toast } from "react-hot-toast";

interface PropertyReservationProps {
  price: number;
  propertyId: string;
  bookings?: SafeBooking[];
  currentUserId?: string;
}

const PropertyReservation = ({
  price,
  propertyId,
  bookings = [],
  currentUserId,
}: PropertyReservationProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(price);

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    bookings.forEach((booking) => {
      const range = eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [bookings]);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const dayCount = differenceInDays(dateRange.to, dateRange.from);

      if (dayCount && price) {
        setTotalPrice(dayCount * price);
      } else {
        setTotalPrice(price);
      }
    }
  }, [dateRange, price]);

  const onCreateBooking = async () => {
    if (!currentUserId) {
      toast.error("Please login to book");
      return;
    }

    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select dates");
      return;
    }

    setIsLoading(true);

    try {
      await createBooking({
        propertyId,
        userId: currentUserId,
        startDate: dateRange.from,
        endDate: dateRange.to,
        totalPrice,
      });

      toast.success("Property booked!");
      setDateRange(undefined);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden">
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">$ {price}</div>
        <div className="font-light text-neutral-600">night</div>
      </div>
      <hr />
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => setDateRange(value)}
      />
      <hr />
      <div className="p-4">
        <Button disabled={isLoading} label="Reserve" onClick={onCreateBooking} />
      </div>
      <hr />
      <div className="p-4 flex flex-row items-center justify-between font-semibold text-lg">
        <div>Total</div>
        <div>$ {totalPrice}</div>
      </div>
    </div>
  );
};

export default PropertyReservation;

import { create } from "zustand";
import { DateRange } from "react-day-picker";

interface BookingStore {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  totalPrice: number;
  setTotalPrice: (price: number) => void;
}

const useBooking = create<BookingStore>((set) => ({
  dateRange: undefined,
  setDateRange: (range) => set({ dateRange: range }),
  totalPrice: 0,
  setTotalPrice: (price) => set({ totalPrice: price }),
}));

export default useBooking;

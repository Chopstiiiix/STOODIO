"use client";

import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

interface CalendarProps {
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
  disabledDates?: Date[];
}

const Calendar = ({ value, onChange, disabledDates }: CalendarProps) => {
  return (
    <DayPicker
      mode="range"
      selected={value}
      onSelect={onChange}
      disabled={disabledDates}
      numberOfMonths={2}
      showOutsideDays
      className="p-3"
    />
  );
};

export default Calendar;

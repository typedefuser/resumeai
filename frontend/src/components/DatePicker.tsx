import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from "date-fns"

import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { useState } from "react";

interface DatePickerProps {
  date: Date | string | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
}

export function DatePicker({ date, setDate, placeholder = 'Pick a date' }: DatePickerProps) {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(date instanceof Date ? date.getFullYear() : undefined);
  const formattedDate = date instanceof Date ? format(date, 'P') : 
                        (typeof date === 'string' && date !== '' ? date : undefined)

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value);
    setSelectedYear(newYear);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (selectedYear) newDate.setFullYear(selectedYear);
      setDate(newDate);
    } else {
      setDate(undefined);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !formattedDate && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate || <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex flex-col">
          <select 
            value={selectedYear}
            onChange={handleYearChange}
            className="mb-2"
          >
            {[...Array(20)].map((_, index) => {
              const year = new Date().getFullYear() - index; // Change this logic to set the range of years you want
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          <Calendar
            mode="single"
            selected={date instanceof Date ? date : undefined}
            onSelect={handleDateSelect}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

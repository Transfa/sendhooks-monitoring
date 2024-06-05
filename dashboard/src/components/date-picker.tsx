"use client";

import * as React from "react";
import { CalendarIcon, Cross1Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import dayjs from "dayjs";

type DatePickerProps = {
  onRemoveComponent: () => void;
  onRemoveFilter: (value: string) => void;
  onDateChange: (value: any) => void;
  placeholder: string;
  fromKey: string;
  toKey: string;
  value: DateRange | undefined;
};

export function DatePicker({
  onRemoveComponent,
  onDateChange,
  value,
  fromKey,
  toKey,
}: {
  onRemoveComponent: () => void;
  onRemoveFilter: (value: string) => void;
  onDateChange: (value: any) => void;
  placeholder: string;
  fromKey: string;
  toKey: string;
  value: DateRange | undefined;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: value?.from,
    to: value?.to,
  });
  return (
    <div className="relative w-[390px]">
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[195px] justify-start text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-1 h-4 w-4" />
              {date?.from ? (
                format(date.from, "PPP")
              ) : (
                <span>Delivered after</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date?.from}
              onSelect={(value) => {
                setDate({
                  ...date,
                  from: value,
                });

                onDateChange({
                  target: {
                    name: fromKey,
                    value: dayjs(value).format("YYYY-MM-DD HH:mm:ss"),
                  },
                });
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[195px] justify-start text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-1 h-4 w-4" />
              {date?.to ? (
                format(date.to, "PPP")
              ) : (
                <span>Delivered before</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date?.to}
              onSelect={(value) => {
                // @ts-ignore
                setDate({
                  ...date,
                  to: value,
                });
                onDateChange({
                  target: {
                    name: toKey,
                    value: dayjs(value).format("YYYY-MM-DD HH:mm:ss"),
                  },
                });
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Cross1Icon
        className="absolute bottom-6 left-96 cursor-pointer border border-black bg-white rounded"
        onClick={onRemoveComponent}
      />
    </div>
  );
}

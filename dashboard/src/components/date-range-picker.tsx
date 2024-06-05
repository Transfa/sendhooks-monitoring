"use client";

import * as React from "react";
import { CalendarIcon, Cross1Icon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import dayjs from "dayjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({
  onRemoveComponent,
  onDateChange,
  placeholder,
  value,
  fromKey,
  toKey,
  onRemoveFilter,
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
    <div className="relative w-[250px]">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[250px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                <>{format(date.from, "LLL dd, y")} - </>
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="w-full flex justify-end">
            <PopoverClose
              className="m-2"
              onClick={() => {
                if (date?.from) {
                  onDateChange({
                    target: {
                      name: fromKey,
                      value: dayjs(date?.from).format("YYYY-MM-DD HH:mm:ss"),
                    },
                  });
                } else {
                  onRemoveFilter(fromKey);
                }

                if (date?.to) {
                  onDateChange({
                    target: {
                      name: toKey,
                      value: dayjs(date?.to).format("YYYY-MM-DD HH:mm:ss"),
                    },
                  });
                } else {
                  onRemoveFilter(toKey);
                }
              }}
            >
              <Button>Ok</Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
      <Cross1Icon
        className="absolute bottom-6 left-60 cursor-pointer border border-black bg-white rounded"
        onClick={onRemoveComponent}
      />
    </div>
  );
}

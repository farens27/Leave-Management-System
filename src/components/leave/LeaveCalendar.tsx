"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plane, PartyPopper, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allHolidays, isHoliday } from "@/data/indonesia-holidays";

type LeaveEvent = {
  employeeName: string;
  startDate: string;
  endDate: string;
  status: string;
};

type CalendarProps = {
  leaves?: LeaveEvent[];
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function nameToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 55%)`;
}

export function LeaveCalendar({ leaves = [] }: CalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const goToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(null);
  };

  const approvedLeaves = useMemo(
    () => leaves.filter((l) => l.status === "APPROVED"),
    [leaves]
  );

  const getLeavesForDate = (dateStr: string) => {
    return approvedLeaves.filter((l) => dateStr >= l.startDate && dateStr <= l.endDate);
  };

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const selectedHoliday = selectedDate ? isHoliday(selectedDate) : undefined;
  const selectedLeaves = selectedDate ? getLeavesForDate(selectedDate) : [];

  const monthHolidays = useMemo(() => {
    return allHolidays.filter((h) => {
      const [y, m] = h.date.split("-").map(Number);
      return y === currentYear && m === currentMonth + 1;
    });
  }, [currentYear, currentMonth]);

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {MONTHS[currentMonth]} {currentYear}
          </h3>
          <Button variant="outline" size="sm" onClick={goToday} className="text-xs h-7 border-gray-200 dark:border-gray-700">
            Today
          </Button>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={prevMonth} className="h-8 w-8 p-0 border-gray-200 dark:border-gray-700">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth} className="h-8 w-8 p-0 border-gray-200 dark:border-gray-700">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-[11px]">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-red-500/80" />
          <span className="text-gray-500 dark:text-gray-400">Holiday</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-emerald-500/80" />
          <span className="text-gray-500 dark:text-gray-400">On Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-blue-500/80" />
          <span className="text-gray-500 dark:text-gray-400">Today</span>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-px">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-[11px] font-semibold text-gray-400 dark:text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        {/* Empty cells */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-gray-50/50 dark:bg-gray-950/50 h-16" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDate(currentYear, currentMonth, day);
          const holiday = isHoliday(dateStr);
          const dayLeaves = getLeavesForDate(dateStr);
          const isToday = dateStr === todayStr;
          const isWeekend = new Date(currentYear, currentMonth, day).getDay() === 0 || new Date(currentYear, currentMonth, day).getDay() === 6;
          const isSelected = selectedDate === dateStr;

          return (
            <div
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : dateStr)}
              className={`relative h-16 p-1 cursor-pointer transition-all duration-150 ${
                isSelected
                  ? "bg-emerald-50 dark:bg-emerald-950/30 ring-2 ring-emerald-500 ring-inset"
                  : "bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900"
              }`}
            >
              <span
                className={`text-[11px] font-medium ${
                  isToday
                    ? "flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-[10px]"
                    : holiday
                    ? "text-red-500 font-bold"
                    : isWeekend
                    ? "text-gray-400 dark:text-gray-600"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {day}
              </span>

              {/* Holiday dot */}
              {holiday && (
                <div className="absolute bottom-1 left-1" title={holiday.name}>
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                </div>
              )}

              {/* Leave indicators */}
              <div className="absolute bottom-1 right-1 flex gap-0.5">
                {dayLeaves.slice(0, 3).map((l, idx) => (
                  <div
                    key={idx}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: nameToColor(l.employeeName) }}
                    title={l.employeeName}
                  />
                ))}
                {dayLeaves.length > 3 && (
                  <span className="text-[8px] text-gray-400">+{dayLeaves.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Date Detail */}
      {selectedDate && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h4>

          {selectedHoliday && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 px-3 py-2">
              <PartyPopper className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-[13px] font-semibold text-red-700 dark:text-red-400">{selectedHoliday.name}</p>
                <p className="text-[11px] text-red-500/70">{selectedHoliday.nameBahasa}</p>
              </div>
            </div>
          )}

          {selectedLeaves.length > 0 ? (
            <div className="space-y-2">
              {selectedLeaves.map((l, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-3 py-2">
                  <Plane className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-[13px] font-semibold text-emerald-700 dark:text-emerald-400">{l.employeeName}</p>
                    <p className="text-[11px] text-emerald-500/70">{l.startDate} → {l.endDate}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : !selectedHoliday ? (
            <p className="text-[13px] text-gray-400">No events on this day</p>
          ) : null}
        </div>
      )}

      {/* Monthly Holiday List */}
      {monthHolidays.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5" />
            Holidays in {MONTHS[currentMonth]}
          </h4>
          <div className="space-y-2">
            {monthHolidays.map((h) => (
              <div key={h.date} className="flex items-center gap-3 text-[13px]">
                <span className="font-mono text-[11px] text-gray-400 w-14">
                  {new Date(h.date + "T00:00:00").toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                </span>
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{h.name}</span>
                  <span className="text-gray-400 ml-1.5 text-[11px]">({h.nameBahasa})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

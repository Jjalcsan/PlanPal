import type { CalendarEvent } from "@/features/calendar/types/CalendarEvent";

const base = new Date("2026-07-29T00:00:00");

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function at(date: Date, hour: number, minute: number): Date {
  const next = new Date(date);
  next.setHours(hour, minute, 0, 0);
  return next;
}

export const mockCalendarEvents: CalendarEvent[] = [
  // Today
  {
    id: "evt-today-1",
    title: "Dentist Appointment",
    description: "Routine check-up",
    location: "Smile Clinic",
    type: "event",
    category: "health",
    startDate: at(base, 9, 0),
    endDate: at(base, 10, 0),
    allDay: false,
    source: "manual",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "evt-today-2",
    title: "Lunch with Alex",
    location: "City Center",
    type: "event",
    category: "personal",
    startDate: at(base, 13, 30),
    endDate: at(base, 14, 30),
    allDay: false,
    source: "manual",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "evt-today-3",
    title: "Gym Session",
    description: "Upper Body",
    type: "event",
    category: "health",
    startDate: at(base, 18, 0),
    endDate: at(base, 19, 15),
    allDay: false,
    source: "manual",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Tomorrow
  {
    id: "evt-tomorrow-1",
    title: "Team Standup",
    type: "event",
    category: "work",
    startDate: at(addDays(base, 1), 10, 0),
    endDate: at(addDays(base, 1), 10, 30),
    allDay: false,
    source: "manual",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "evt-tomorrow-2",
    title: "Project Deadline",
    description: "Submit final deliverables",
    type: "task_deadline",
    category: "work",
    startDate: at(addDays(base, 1), 17, 0),
    allDay: false,
    source: "manual",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Day after tomorrow
  {
    id: "evt-future-1",
    title: "Maria's Birthday",
    type: "birthday",
    category: "birthday",
    startDate: addDays(base, 3),
    allDay: true,
    source: "manual",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Next week
  {
    id: "evt-future-2",
    title: "Weekend Hike",
    description: "Mountain trail",
    location: "National Park",
    type: "event",
    category: "health",
    startDate: at(addDays(base, 6), 8, 0),
    endDate: at(addDays(base, 6), 14, 0),
    allDay: false,
    source: "manual",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // All-day work event
  {
    id: "evt-future-3",
    title: "Company Offsite",
    type: "event",
    category: "work",
    startDate: addDays(base, 9),
    allDay: true,
    source: "manual",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

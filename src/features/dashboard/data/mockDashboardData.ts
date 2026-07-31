import type { DashboardData } from "@/features/dashboard/types/DashboardData";

export const mockDashboardData: DashboardData = {
  tasks: {
    pending: 7,
    completed: 12,
    overdue: 2,
    dueToday: 3,
  },
  events: {
    today: [
      {
        id: "evt-1",
        title: "Team standup",
        type: "event",
        startDate: new Date(),
        allDay: false,
        source: "manual",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    upcoming: [
      {
        id: "evt-2",
        title: "Dentist appointment",
        type: "reminder",
        startDate: new Date(Date.now() + 86_400_000),
        allDay: true,
        source: "manual",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "evt-3",
        title: "Grocery shopping",
        type: "event",
        startDate: new Date(Date.now() + 2 * 86_400_000),
        allDay: true,
        source: "manual",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  lists: {
    incomplete: 5,
    completed: 8,
    renewingSoon: 1,
  },
  statistics: {
    tasksCompletedThisWeek: 9,
    completionRate: 0.63,
  },
};

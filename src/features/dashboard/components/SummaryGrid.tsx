import {
  CalendarCard,
  ListsCard,
  TasksCard,
} from "@/features/dashboard/components";
import type { Task } from "@/features/tasks/types/Task";
import type { CalendarEvent } from "@/features/calendar/types/CalendarEvent";
import type { List } from "@/features/lists/types/List";

interface SummaryGridProps {
  tasks: Task[];
  events: CalendarEvent[];
  lists: List[];
}

export function SummaryGrid({ tasks, events, lists }: SummaryGridProps) {
  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
      <TasksCard totalPending={tasks.length} pendingTasks={tasks} />
      <CalendarCard events={events} />
      <ListsCard lists={lists} />
    </section>
  );
}


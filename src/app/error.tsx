"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <button
        onClick={() => reset()}
        className="rounded-md bg-foreground px-4 py-2 text-sm text-background"
      >
        Try again
      </button>
    </div>
  );
}
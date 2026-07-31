"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-2">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <button
            onClick={() => reset()}
            className="rounded-md bg-foreground px-4 py-2 text-sm text-background"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
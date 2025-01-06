import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { TraceCard } from "@/app/components/traces/trace-card";
import { type Trace } from "@/types";

function TracesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-slate-800/50 h-32 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}

// This component handles fetching and displaying traces
async function TracesFeed() {
  // I'll replace this with real data fetching later
  const traces: Trace[] = [
    {
      id: "1",
      type: "github",
      user: "sarah_codes",
      time: "2:34 AM",
      content:
        "Finally fixed that authentication edge case. The midnight debugging session paid off! 🎉",
      metadata: {
        title: "Fix auth token refresh logic",
        url: "https://github.com/...",
      },
    },
    {
      id: "2",
      type: "spotify",
      user: "night_hacker",
      time: "3:15 AM",
      content: "Perfect coding soundtrack for this late-night session.",
      metadata: {
        title: "lofi beats to code to",
        artist: "Various Artists",
      },
    },
  ];

  return (
    <div className="space-y-4">
      {traces.map((trace) => (
        <TraceCard key={trace.id} trace={trace} />
      ))}
    </div>
  );
}

export default async function HomePage() {
  const user = await currentUser();

  return (
    <div className="min-h-screen">
      {!user && (
        // Hero section for non-authenticated users
        <div className="py-12 border-b border-slate-800">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-white font-mono mb-4">
              Where night owls gather
            </h1>
            <p className="text-lg text-slate-400 mb-6">
              Join a community of developers, creators, and thinkers who come
              alive at night. Share your late-night coding sessions, discover
              what others are building, and find your nocturnal rhythm.
            </p>
          </div>
        </div>
      )}

      {/* Feed section */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-mono font-bold text-white">
            night_traces
          </h2>
          <time className="text-sm text-slate-400">
            {new Date().toLocaleTimeString()}
          </time>
        </div>

        <Suspense fallback={<TracesSkeleton />}>
          <TracesFeed />
        </Suspense>
      </div>
    </div>
  );
}

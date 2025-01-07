"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
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

function TracesFeed() {
  const [traces, setTraces] = useState<Trace[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchTraces() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/traces`,
          {
            cache: "no-store", // Disable caching to get fresh data
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTraces(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchTraces();
  }, []);

  if (loading) {
    return <TracesSkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        Failed to load traces. Please try again later.
      </div>
    );
  }

  if (!traces || traces.length === 0) {
    return (
      <div className="text-center text-slate-500 py-8">
        No traces yet. Be the first to leave one!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {traces.map((trace: Trace) => (
        <TraceCard key={trace.id} trace={trace} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { user } = useUser();
  console.log("user:", user);

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

        <TracesFeed />
      </div>
    </div>
  );
}

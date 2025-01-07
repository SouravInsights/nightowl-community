"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Github, Plus, Loader2, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { GitHubActivity } from "@/types/github";
import { cn } from "@/lib/utils";

export default function NewTrace() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [githubActivities, setGithubActivities] = useState<GitHubActivity[]>(
    []
  );
  const [selectedActivity, setSelectedActivity] =
    useState<GitHubActivity | null>(null);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activeTab, setActiveTab] = useState<"manual" | "github">("manual");

  console.log("error:", error);

  const fetchGitHubActivities = async () => {
    if (githubActivities.length > 0) return;

    setLoadingActivities(true);
    try {
      const response = await fetch("/api/traces/github", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to fetch GitHub activities");

      const data = await response.json();
      console.log("github data traces");
      setGithubActivities(data.traces);
    } catch (error) {
      console.error("Failed to fetch GitHub activities:", error);
      setError("Failed to load GitHub activities");
    } finally {
      setLoadingActivities(false);
    }
  };

  console.log("githubActivities:", githubActivities);

  const selectActivity = (activity: GitHubActivity) => {
    setSelectedActivity(activity);
    setContent(activity.metadata.title);
  };

  const createTrace = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/traces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          type: selectedActivity ? "github" : "manual",
          metadata: selectedActivity?.metadata || {},
        }),
      });

      if (!response.ok) throw new Error("Failed to create trace");

      setContent("");
      setSelectedActivity(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to create trace:", error);
      setError("Failed to create trace");
    } finally {
      setIsSubmitting(false);
    }
  };

  // <DialogContent className="sm:max-w-[600px] h-[80vh] p-0 bg-slate-900 border-slate-800">

  return (
    <DialogContent className="sm:max-w-[600px] h-[80vh] p-0 w-[95vw] bg-slate-900 border-slate-800">
      {/* Header Section */}
      <div className="p-6 pb-0">
        <DialogHeader>
          <DialogTitle className="text-white">Leave a trace</DialogTitle>
          <DialogDescription className="text-slate-400">
            Share your night owl moments with the community
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}

        <div className="flex gap-2 border-b border-slate-800 pb-4 pt-4 justify-center sm:justify-start">
          <button
            onClick={() => setActiveTab("manual")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
              activeTab === "manual"
                ? "bg-yellow-500/10 text-yellow-500"
                : "text-slate-400 hover:bg-slate-800"
            )}
          >
            <PenLine className="w-4 h-4" />
            <span>Manual</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("github");
              fetchGitHubActivities();
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
              activeTab === "github"
                ? "bg-yellow-500/10 text-yellow-500"
                : "text-slate-400 hover:bg-slate-800"
            )}
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-8">
        {activeTab === "github" && (
          <div className="space-y-4">
            {loadingActivities ? (
              <ActivitySkeleton />
            ) : (
              githubActivities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => selectActivity(activity)}
                  className={cn(
                    "w-full p-2 rounded-lg border text-left transition-colors",
                    selectedActivity?.id === activity.id
                      ? "bg-yellow-500/10 border-yellow-500/50"
                      : "bg-slate-800/50 border-slate-800 hover:border-slate-700"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Github className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">
                        {activity.metadata.title}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">
                        {activity.metadata.repo}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="border-t border-slate-800 p-6 mt-auto">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            activeTab === "manual"
              ? "What's keeping you up tonight?"
              : "Add a note about this activity..."
          }
          className="mb-4 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 h-[100px] resize-none"
        />
        <div className="flex justify-end">
          <Button
            onClick={createTrace}
            disabled={isSubmitting || !content.trim()}
            className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Creating..." : "Create Trace"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-slate-800/50 h-16 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}

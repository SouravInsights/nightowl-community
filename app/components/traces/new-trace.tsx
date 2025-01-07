// new-trace.tsx
"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Github, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { GitHubActivity } from "@/types/github";
import { cn } from "@/lib/utils";

function GitHubActivityCard({
  activity,
  isSelected,
  onClick,
}: {
  activity: GitHubActivity;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-3 rounded-lg border text-left transition-all",
        isSelected
          ? "bg-slate-800 border-yellow-500/50 ring-1 ring-yellow-500/20"
          : "bg-slate-900/50 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Github className="w-4 h-4 text-green-400" />
        <span className="text-sm font-medium text-slate-300">
          {activity.metadata.repo}
        </span>
      </div>
      <p className="text-sm text-slate-300 line-clamp-2">
        {activity.metadata.title}
      </p>
      <time className="text-xs text-slate-500 mt-2 block">
        {new Date(activity.createdAt).toLocaleString()}
      </time>
    </button>
  );
}

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

  return (
    <DialogContent className="bg-slate-900 border-slate-800 sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="text-white">Leave a trace</DialogTitle>
      </DialogHeader>

      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as "manual" | "github");
          if (v === "github") fetchGitHubActivities();
        }}
      >
        <TabsList className="grid grid-cols-2 bg-slate-800">
          <TabsTrigger
            value="manual"
            className="data-[state=active]:bg-slate-700"
          >
            Manual
          </TabsTrigger>
          <TabsTrigger
            value="github"
            className="data-[state=active]:bg-slate-700"
          >
            GitHub Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="manual"
          className="space-y-4 focus-visible:outline-none"
        >
          <Textarea
            placeholder="What's keeping you up tonight?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
            rows={3}
          />
        </TabsContent>

        <TabsContent
          value="github"
          className="space-y-4 focus-visible:outline-none"
        >
          {loadingActivities ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2">
              {githubActivities.map((activity) => (
                <GitHubActivityCard
                  key={activity.id}
                  activity={activity}
                  isSelected={selectedActivity?.id === activity.id}
                  onClick={() => selectActivity(activity)}
                />
              ))}
            </div>
          )}

          {selectedActivity && (
            <div className="space-y-2">
              <div className="p-2 bg-slate-800/50 rounded border border-slate-700">
                <p className="text-sm text-slate-400">Selected activity:</p>
                <p className="text-white font-medium">
                  {selectedActivity.metadata.title}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {selectedActivity.metadata.repo}
                </p>
              </div>

              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Add a note about this activity..."
                rows={2}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end">
        <Button
          onClick={createTrace}
          disabled={isSubmitting || !content.trim()}
          className="bg-slate-800 hover:bg-slate-700"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          {isSubmitting ? "Creating..." : "Create Trace"}
        </Button>
      </div>
    </DialogContent>
  );
}

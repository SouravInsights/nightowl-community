"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Github, Music, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { GitHubActivity } from "@/types/github";

export default function NewTrace() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGitHubActivity, setShowGitHubActivity] = useState(false);
  const [githubActivities, setGithubActivities] = useState<GitHubActivity[]>(
    []
  );
  const [selectedActivity, setSelectedActivity] =
    useState<GitHubActivity | null>(null);

  const [loadingActivities, setLoadingActivities] = useState(false);

  // Fetch GitHub activities when GitHub icon is clicked
  const fetchGitHubActivities = async () => {
    setLoadingActivities(true);
    try {
      const response = await fetch("/api/traces/github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch GitHub activities: ${response.status}`
        );
      }

      const data = await response.json();
      setGithubActivities(data.traces);
    } catch (error) {
      console.error("Failed to fetch GitHub activities:", error);
    } finally {
      setLoadingActivities(false);
    }
  };

  // When user selects an activity, pre-fill the trace content
  const selectActivity = (activity: GitHubActivity) => {
    setContent(activity.content);
    setSelectedActivity(activity);
    setShowGitHubActivity(false);
  };

  const createTrace = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/traces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          type: selectedActivity ? "github" : "manual",
        }),
      });

      if (!response.ok) throw new Error("Failed to create trace");

      setContent("");
      setSelectedActivity(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to create trace:", error);
      setError("Failed to create trace. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="bg-slate-900 border-slate-800">
      <DialogHeader>
        <DialogTitle className="text-white">Leave a trace</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {selectedActivity && (
          <div className="p-2 bg-slate-800 border border-slate-700 rounded-md">
            <p className="text-sm text-slate-400">
              <strong>Selected Activity:</strong>
            </p>
            <p className="text-white">{selectedActivity.content}</p>
            <p className="text-slate-500 text-xs">
              {new Date(selectedActivity.createdAt || "").toLocaleString()}
            </p>
          </div>
        )}

        <Textarea
          placeholder="What's keeping you up tonight?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
          rows={3}
        />

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-green-400"
              onClick={() => {
                setShowGitHubActivity(!showGitHubActivity);
                if (!githubActivities.length) fetchGitHubActivities();
              }}
              disabled={loadingActivities}
            >
              {loadingActivities ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Github className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-green-400"
            >
              <Music className="w-4 h-4" />
            </Button>
          </div>

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

        {showGitHubActivity && (
          <div className="mt-4 p-2 bg-slate-800 border border-slate-700 rounded-md space-y-2 max-h-48 overflow-y-auto">
            {githubActivities.length > 0 ? (
              githubActivities.map((activity) => (
                <div
                  key={2}
                  className="p-2 hover:bg-slate-700 rounded-md cursor-pointer"
                  onClick={() => selectActivity(activity)}
                >
                  <p className="text-white">{activity.content}</p>
                  <p className="text-slate-500 text-xs">
                    {new Date(activity.createdAt || "").toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm">No activities found.</p>
            )}
          </div>
        )}
      </div>
    </DialogContent>
  );
}

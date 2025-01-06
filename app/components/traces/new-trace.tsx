"use client";

import { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Github, Music, Plus } from "lucide-react";

export default function NewTrace() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createTrace = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/traces", {
        method: "POST",
        body: JSON.stringify({ content, type: "manual" }),
      });
      setContent("");
    } catch (error) {
      console.error("Failed to create trace:", error);
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
            >
              <Github className="w-4 h-4" />
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
            <Plus className="w-4 h-4 mr-2" />
            Create Trace
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

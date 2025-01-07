import { type Trace } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Music } from "lucide-react";

interface TraceCardProps {
  trace: Trace;
}

export function TraceCard({ trace }: TraceCardProps) {
  const TraceIcon = () => {
    switch (trace.type) {
      case "github":
        return <Github className="w-4 h-4 text-green-400" />;
      case "spotify":
        return <Music className="w-4 h-4 text-green-400" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <TraceIcon />
            <span className="font-mono text-sm text-slate-400">
              {trace.user}
            </span>
          </div>
          <span className="text-xs text-slate-500">{trace.time}</span>
        </div>

        <p className="mt-2 text-slate-200">{trace.content}</p>

        {trace.metadata && (
          <div className="mt-3 p-2 bg-slate-800/50 rounded-md">
            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <TraceIcon />
              <span className="font-semibold">{trace.metadata.title}</span>
            </div>
            {trace.type === "github" && (
              <div className="mt-2 text-sm text-slate-400">
                <p>
                  Repository: {trace.metadata.repository || trace.metadata.repo}
                </p>
                <a
                  href={`https://github.com/${trace.metadata.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  View on GitHub
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

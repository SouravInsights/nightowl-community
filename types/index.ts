export type TraceType = "github" | "spotify" | "manual";

export interface TraceMetadata {
  title: string;
  url?: string;
  artist?: string;
  repository?: string;
  repo?: string;
}

export interface Trace {
  id: string;
  type: TraceType;
  user: string;
  time: string;
  content: string;
  metadata?: TraceMetadata;
}

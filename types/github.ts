import { type Octokit } from "octokit";

type OctokitResponse = Awaited<
  ReturnType<Octokit["rest"]["activity"]["listPublicEventsForUser"]>
>;
export type GitHubEvent = OctokitResponse["data"][0] & {
  id: string;
  type: string;
  created_at: string;
  payload: {
    action?: string;
    commits?: Array<{ message: string }>;
    pull_request?: {
      title: string;
    };
    ref_type?: string;
  };
};

export interface GitHubActivity {
  id: string;
  userId: string;
  type: "github";
  content: string;
  metadata: {
    type: string;
    url: string;
    repo: string;
    title: string;
  };
  createdAt: string | Date;
}

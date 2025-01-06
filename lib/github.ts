import { GitHubActivity, GitHubEvent } from "@/types/github";
import { Octokit } from "octokit";

export async function getGitHubActivity(
  userId: string,
  accessToken: string,
  username: string
): Promise<GitHubActivity[]> {
  const octokit = new Octokit({ auth: accessToken });

  const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
    username,
    per_page: 10,
  });

  return events.map(
    (event): GitHubActivity => ({
      userId,
      type: "github",
      content: formatGitHubEvent(event as GitHubEvent),
      metadata: {
        type: event.type || "unknown",
        url: event.repo.url,
        repo: event.repo.name,
        title: getEventTitle(event as GitHubEvent),
      },
      createdAt: new Date(event.created_at || Date.now()),
    })
  );
}

function formatGitHubEvent(event: GitHubEvent): string {
  switch (event.type) {
    case "PushEvent":
      return `Pushed ${event.payload.commits?.length || 0} commits to ${
        event.repo.name
      }`;
    case "PullRequestEvent":
      return `${event.payload.action} pull request in ${event.repo.name}`;
    case "CreateEvent":
      return `Created ${event.payload.ref_type} in ${event.repo.name}`;
    default:
      return `Activity in ${event.repo.name}`;
  }
}

function getEventTitle(event: GitHubEvent): string {
  switch (event.type) {
    case "PushEvent":
      return event.payload.commits?.[0]?.message || "Push event";
    case "PullRequestEvent":
      return event.payload.pull_request?.title || "Pull request";
    default:
      return event.type;
  }
}

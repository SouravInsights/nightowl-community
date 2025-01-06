import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { traces } from "@/db/schema";
import { getGitHubActivity } from "@/lib/github";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const githubAccount = user.externalAccounts.find(
      (account) => account.provider === "github"
    );

    if (!githubAccount) {
      return new Response("GitHub account not connected", { status: 400 });
    }

    const activities = await getGitHubActivity(
      user.id,
      githubAccount.externalId,
      githubAccount.username ?? ""
    );

    // Insert activities one by one to handle type validation
    for (const activity of activities) {
      await db.insert(traces).values(activity);
    }

    return Response.json(activities);
  } catch (error) {
    console.error("GitHub trace error:", error);
    return new Response("Failed to fetch GitHub activity", { status: 500 });
  }
}

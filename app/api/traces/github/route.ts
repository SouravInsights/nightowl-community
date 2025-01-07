import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db";
import { traces } from "@/db/schema";
import { getGitHubActivity } from "@/lib/github";
import { NextResponse } from "next/server";
import { Octokit } from "octokit";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const githubAccount = user.externalAccounts.find(
      (account) => account.provider === "oauth_github"
    );

    if (!githubAccount) {
      return NextResponse.json(
        { error: "GitHub account not connected" },
        { status: 400 }
      );
    }

    // Get the token using Clerk's OAuth API
    const clerk = await clerkClient();
    const tokenResponse = await clerk.users.getUserOauthAccessToken(
      user.id,
      "oauth_github"
    );

    console.log("GitHub OAuth response:", tokenResponse);

    // Get the first token from the data array
    const token = tokenResponse.data[0]?.token;

    if (!token) {
      return NextResponse.json(
        { error: "Could not get GitHub token" },
        { status: 400 }
      );
    }

    // Try getting the authenticated user first to test token
    const octokit = new Octokit({
      auth: token,
    });

    try {
      const { data: authUser } = await octokit.rest.users.getAuthenticated();
      console.log("Authenticated as:", authUser.login);
    } catch (error) {
      console.error("GitHub auth test failed:", error);
      return NextResponse.json(
        { error: "Invalid GitHub token" },
        { status: 401 }
      );
    }

    const activities = await getGitHubActivity(
      user.id,
      githubAccount.username ?? "",
      token
    );

    const newTraces = await db.insert(traces).values(activities).returning();

    return NextResponse.json({ traces: newTraces });
  } catch (error) {
    console.error("GitHub trace error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch GitHub activity",
      },
      { status: 500 }
    );
  }
}

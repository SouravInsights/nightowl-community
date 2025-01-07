import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { traces } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("GET /api/traces hit");
  try {
    const allTraces = await db.query.traces.findMany({
      orderBy: [desc(traces.createdAt)],
      limit: 20,
    });

    return NextResponse.json(allTraces);
  } catch (error) {
    console.error("Failed to fetch traces:", error);
    return new Response("Failed to fetch traces", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { type, content, metadata } = await req.json();
    console.log("metadata:", metadata);

    const trace = await db
      .insert(traces)
      .values({
        userId: user.id,
        type,
        content,
        metadata: metadata || {},
      })
      .returning();

    return NextResponse.json(trace[0]);
  } catch (error) {
    console.error("Failed to create trace:", error);
    return new Response("Failed to create trace", { status: 500 });
  }
}

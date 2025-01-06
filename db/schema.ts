import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const traces = pgTable("traces", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type", { enum: ["github", "spotify", "manual"] }).notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

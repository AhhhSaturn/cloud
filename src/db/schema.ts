import { createId } from "@paralleldrive/cuid2";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: varchar("id")
		.$defaultFn(() => createId()) // will swap to use discord ids when we start using discord for auth.
		.primaryKey(),
	username: varchar("username").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const table = {
	users,
} as const;

export type Table = typeof table;

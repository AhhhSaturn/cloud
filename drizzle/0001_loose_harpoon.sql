ALTER TABLE "users" RENAME TO "clouds";--> statement-breakpoint
ALTER TABLE "clouds" ADD COLUMN "date" date;--> statement-breakpoint
ALTER TABLE "clouds" ADD COLUMN "cloud_count" integer;--> statement-breakpoint
ALTER TABLE "clouds" DROP COLUMN "created_at";
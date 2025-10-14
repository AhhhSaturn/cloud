CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

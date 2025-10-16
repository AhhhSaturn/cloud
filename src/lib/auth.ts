import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { tables } from "../db/schema"; // your drizzle instance

export const auth = betterAuth({
	socialProviders: {
		discord: {
			clientId: Bun.env.CLIENT_ID,
			clientSecret: Bun.env.DISCORD_SECRET,
		},
	},
	database: drizzleAdapter(tables, {
		provider: "pg",
	}),
	trustedOrigins: ["http://localhost:5174"],
	basePath: "/api/auth",
	plugins: [sveltekitCookies(getRequestEvent)],
});

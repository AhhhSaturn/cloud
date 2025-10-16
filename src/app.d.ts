// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module "bun" {
	interface Env {
		DISCORD_TOKEN: string;
		DISCORD_SECRET: string;
		DISCORD_CALLBACK: string;
		CLIENT_ID: string;
		DATABASE_URL: string;
	}
}

export {};

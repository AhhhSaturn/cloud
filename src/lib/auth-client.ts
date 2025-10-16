import { createAuthClient } from "better-auth/svelte";

export const authClient = createAuthClient({
	baseURL: `http://localhost:5174/api/auth`,
});

export const signIn = async () => {
	const data = await authClient.signIn.social({
		provider: "discord",
	});
	console.log(data);
};

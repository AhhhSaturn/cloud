import { redis } from "bun";
import { Elysia, t } from "elysia";
import { drizzle } from "drizzle-orm/bun-sql";

const db = drizzle(process.env.DATABASE_URL!);

const app = new Elysia({ prefix: "/api" })
	.post("/", async ({ body }) => await redis.hgetall(body), {
		body: t.String(),
	})
	.post(
		"/set",
		({ body }) => {
			console.log(body.date);
			redis.set(body.date, body.count.toString());
		},
		{
			body: t.Object({
				date: t.String(),
				count: t.Number(),
			}),
		},
	);

type RequestHandler = (v: { request: Request }) => Response | Promise<Response>;
export const fallback: RequestHandler = ({ request }) => app.handle(request);
export type API = typeof app;

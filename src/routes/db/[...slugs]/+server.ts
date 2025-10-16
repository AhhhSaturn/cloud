import { and, between, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sql";
import { Elysia, t } from "elysia";
import { clouds as Clouds } from "../../../db/schema";

const db = drizzle(process.env.DATABASE_URL!);

const app = new Elysia({ prefix: "/db" })
	.post(
		"/",
		async ({ body: { startDate, endDate } }) => {
			const forceEnd = "2038-1-19";
			const data = await db
				.select({
					date: Clouds.date,
					clouds: Clouds.clouds,
				})
				.from(Clouds)
				.where(
					and(
						eq(Clouds.user_id, "893228195065757758"),
						between(Clouds.date, startDate, endDate || forceEnd),
					),
				)
				.orderBy(Clouds.date)
				.execute();
			return data;
		},
		{
			body: t.Object({
				startDate: t.String(),
				endDate: t.Optional(t.String()),
			}),
		},
	)
	.put(
		"/",
		async ({ body: { date, clouds }, set }) => {
			await db
				.insert(Clouds)
				.values({
					user_id: "893228195065757758",
					clouds,
					date,
				})
				.onConflictDoUpdate({
					target: Clouds.date,
					set: { clouds },
				})
				.execute()
				.then(() => {
					return 200;
				})
				.catch((err) => {
					console.log("ERROR:", err);
					set.status = "Internal Server Error";
					return;
				});
		},
		{
			body: t.Object({
				date: t.String(),
				clouds: t.Number(),
			}),
		},
	)
	.delete(
		"/",
		async ({ body }) => {
			db.delete(Clouds)
				.where(
					and(eq(Clouds.user_id, "893228195065757758"), eq(Clouds.date, body)),
				)
				.execute();
		},
		{ body: t.String() },
	);

type RequestHandler = (v: { request: Request }) => Response | Promise<Response>;
export const fallback: RequestHandler = ({ request }) => app.handle(request);
export type API = typeof app;

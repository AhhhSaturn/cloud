import { redis } from "bun";

await redis.hmset("2024:10", ["1", "100", "3", "200"]);

const values = await redis.hgetall("2024:10");

const days: string[] = [];

for (const day of values) {
}

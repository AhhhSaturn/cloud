<script lang="ts">
import { treaty } from "@elysiajs/eden";
import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
import { scaleUtc } from "d3-scale";
import { curveCardinal } from "d3-shape";
import { LineChart } from "layerchart";
import { onMount } from "svelte";
import * as Card from "$lib/components/ui/card/index.js";
import * as Chart from "$lib/components/ui/chart/index.js";
import type { API } from "../../routes/api/[...slugs]/+server";

const { api } = treaty<API>("localhost:5173");

const chartData: { date: Date; clouds: number }[] = [
	{ date: new Date("2025-10-03"), clouds: 197 },
	{ date: new Date("2025-10-04"), clouds: 188 },
	{ date: new Date("2025-10-05"), clouds: 164 },
	{ date: new Date("2025-10-06"), clouds: 476 },
];
onMount(async () => {
	const days = (await api.post("2024:10")).data;
	// console.log(days[1]);
	console.log(days);
});

const chartConfig = {
	clouds: { label: "Clouds", color: "var(--chart-1)" },
};
</script>

<Card.Root>
  <Card.Content>
    <Chart.Container config={chartConfig}>
      <LineChart
        points={{ r: 4 }}
        data={chartData}
        x="date"
        xScale={scaleUtc()}
        axis
        series={[
          {
            key: "clouds",
            label: "Clouds",
            color: chartConfig.clouds.color,
          },
        ]}
        props={{
          spline: { curve: curveCardinal, motion: "tween", strokeWidth: 2 },
          highlight: {
            points: {
              motion: "spring",
              r: 6,
            },
          },
          xAxis: {
            format: (v: Date) => v.toLocaleDateString("en-GB", { month: "short",day: "numeric" }),
          },
        }}
      >
        {#snippet tooltip()}
          <Chart.Tooltip hideLabel />
        {/snippet}
      </LineChart>
    </Chart.Container>
  </Card.Content>
</Card.Root>

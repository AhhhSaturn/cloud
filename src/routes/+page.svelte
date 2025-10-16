<script lang="ts">
import { treaty } from "@elysiajs/eden";
import {
	type CalendarDate,
	getLocalTimeZone,
	today,
} from "@internationalized/date";
import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
import { scaleUtc } from "d3-scale";
import { curveCardinal } from "d3-shape";
import { LineChart } from "layerchart";
import { onMount } from "svelte";
import { toast } from "svelte-sonner";
import { page } from "$app/state";
import { signIn } from "$lib/auth-client";
import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
import { Button, buttonVariants } from "$lib/components/ui/button";
import Calendar from "$lib/components/ui/calendar/calendar.svelte";
import * as Card from "$lib/components/ui/card/index.js";
import * as Chart from "$lib/components/ui/chart/index.js";
import * as Drawer from "$lib/components/ui/drawer";
import Input from "$lib/components/ui/input/input.svelte";
import { Label } from "$lib/components/ui/label/index.js";
import * as Popover from "$lib/components/ui/popover/index.js";
import Spinner from "$lib/components/ui/spinner/spinner.svelte";
import type { API } from "./api/[...slugs]/+server";

const { api } = treaty<API>(`http://${page.url.host}`, {
	fetch: {
		credentials: "include",
	},
});

let drawerOpen = $state(false);
// biome-ignore lint/style/useConst: is bound too
let calOpen = $state(false);
// biome-ignore lint/style/useConst: is bound too
let date = $state(today(getLocalTimeZone()));
let cloudCount = $state(0);
let context = $state("");

const saveRecord = () => {
	context = "saving";
	const key = `${date?.year}-${date?.month}-${date?.day}`;
	api.put({ date: key, clouds: cloudCount }).then((data) => {
		drawerOpen = false;
		context = "";
		cloudCount = 0;
		if (data.error) {
			toast.error("Failed to save.");
			return;
		}
		toast.success("Saved!");
		updateChart();
	});
};

const deleteRecord = async () => {
	context = "saving";
	const key = `${date?.year}-${date?.month}-${date?.day}`;
	await api.delete(key).then((data) => {
		drawerOpen = false;
		context = "";
		if (data.error) {
			toast.error("Failed to delete.");
			return;
		}
		toast.success("Deleted!");
		updateChart();
	});
};

const updateChart = async () => {
	chartData = (
		await api.post({
			startDate: "2025-10-03",
			// endDate: "2025-10-04",
		})
	).data;
};

let chartData: { date: Date; clouds: number }[] = $state([]);
onMount(updateChart);

const chartConfig = {
	clouds: { label: "Clouds", color: "var(--chart-1)" },
};
</script>

<Card.Root>
  <Card.Content>
    <Chart.Container config={chartConfig}>
        {#key chartData}
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
        {/key}
    </Chart.Container>
  </Card.Content>
</Card.Root>

<Drawer.Root bind:open={drawerOpen} >
    <Drawer.Trigger class={buttonVariants({ variant: "outline" })}
        >Add Clouds</Drawer.Trigger
      >
 <Drawer.Content>
  <Drawer.Header>
   <Drawer.Title>Add Cloud Count</Drawer.Title>
   <Drawer.Description>or edit previous count</Drawer.Description>
    <div class="flex flex-row gap-3">
    <Popover.Root bind:open={calOpen}>
        <Popover.Trigger>
        {#snippet child({ props })}
        <Button
        {...props}
        variant="outline"
        class="w-48 justify-between font-normal"
        >
        {date
            ? date.toDate(getLocalTimeZone()).toLocaleDateString()
            : "Select date"}
        <ChevronDownIcon />
        </Button>
        {/snippet}
        </Popover.Trigger>
        <Popover.Content class="w-auto overflow-hidden p-0" align="start">
        <Calendar
        type="single"
        bind:value={date}
        captionLayout="dropdown"
        onValueChange={() => {
        calOpen = false;
        }}
        maxValue={today(getLocalTimeZone())}
        />
        </Popover.Content>
    </Popover.Root>
    <Input bind:value={cloudCount} type='number' min="0" placeholder="Cloud Count" />
    </div>
    </Drawer.Header>
  <Drawer.Footer>
      {#if context === 'saving'}
          <Button disabled>Saving... <Spinner class="size-6" /></Button>
	{:else}
	    <div class="grid grid-cols-3 gap-4">
            <Button class="col-span-2" onclick={saveRecord}>Save</Button>
      		<AlertDialog.Root>
              <AlertDialog.Trigger class={buttonVariants({ variant: "destructive" })}>
                  Delete
              </AlertDialog.Trigger>
              <AlertDialog.Content>
                <AlertDialog.Header>
                  <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                  <AlertDialog.Description>
                    This action cannot be undone. This will permanently this record from the database.
                  </AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                  <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                  <AlertDialog.Action class={buttonVariants({variant: 'destructive'})} onclick={deleteRecord}>Continue</AlertDialog.Action>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog.Root>
		</div>
      {/if}
  </Drawer.Footer>
 </Drawer.Content>
</Drawer.Root>

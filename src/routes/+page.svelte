<script lang="ts">
import { treaty } from "@elysiajs/eden";
import {
	type CalendarDate,
	getLocalTimeZone,
	today,
} from "@internationalized/date";
import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
import { toast } from "svelte-sonner";
import Graph from "$lib/components/graph.svelte";
import { Button, buttonVariants } from "$lib/components/ui/button";
import Calendar from "$lib/components/ui/calendar/calendar.svelte";
import * as Drawer from "$lib/components/ui/drawer";
import Input from "$lib/components/ui/input/input.svelte";
import { Label } from "$lib/components/ui/label/index.js";
import * as Popover from "$lib/components/ui/popover/index.js";
import Spinner from "$lib/components/ui/spinner/spinner.svelte";
import type { API } from "./api/[...slugs]/+server";

const { api } = treaty<API>("localhost:5173");

let drawerOpen = $state(false);
// biome-ignore lint/style/useConst: is bound too
let calOpen = $state(false);
// biome-ignore lint/style/useConst: is bound too
let date = $state(today(getLocalTimeZone()));
let cloudCount = $state(0);
let context = $state("");

const save = () => {
	context = "saving";
	const key = `${date?.year}-${date?.month}-${date?.day}`;
	api.set.post({ date: key, count: cloudCount }).then(() => {
		drawerOpen = false;
		context = "";
		cloudCount = 0;
		toast.success("Saved!");
	});
};
</script>

<Graph/>

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
        <Button onclick={save}>Save</Button>
      {/if}
  </Drawer.Footer>
 </Drawer.Content>
</Drawer.Root>

<script lang="ts">
	import { resolve } from '$app/paths';
	import { loadScreenshotAllScores, type ScreenshotScore } from '$lib/storage';
	import { getDailyInfo } from '$lib/api.svelte';
	import { onMount } from 'svelte';

	const msPerDay = 86400000;

	function keyToMs(key: string): number {
		const [dd, mm, yyyy] = key.split('-').map(Number);
		return Date.UTC(yyyy, mm - 1, dd);
	}

	function displayDate(slug: string): string {
		const [dd, mm, yyyy] = slug.split('-').map(Number);
		return new Date(Date.UTC(yyyy, mm - 1, dd)).toLocaleDateString(undefined, {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			timeZone: 'UTC'
		});
	}

	const todayMs = Date.now() - (Date.now() % msPerDay);

	const perPage = 21;

	let page = $state(0);
	let scoreInfo = $state<ScreenshotScore[] | undefined>();
	let dailyDays = $state<string[]>([]);

	// only real, past days from daily.json — newest first
	const previousDays = $derived(
		dailyDays.filter((k) => keyToMs(k) < todayMs).sort((a, b) => keyToMs(b) - keyToMs(a))
	);
	const pageCount = $derived(Math.max(1, Math.ceil(previousDays.length / perPage)));
	const pageDays = $derived(previousDays.slice(page * perPage, (page + 1) * perPage));
	const scoreFor = (day: string) => scoreInfo?.find((s) => s.date === day);

	onMount(async () => {
		scoreInfo = loadScreenshotAllScores();

		const info = await getDailyInfo(fetch);
		if (info) dailyDays = Object.keys(info.days);
	});
</script>

<div class="mx-auto w-[90%] max-w-lg py-10">
	<div class="mb-5 flex items-center justify-between">
		<a
			href={resolve('/screenshot/')}
			class="border-0 bg-transparent px-0 text-sm text-(--text-muted) hover:text-(--text)"
		>
			← Back
		</a>
		<h1 class="text-lg font-bold">Previous Days</h1>
		<span class="w-12"></span>
	</div>

	{#if previousDays.length === 0}
		<p class="py-10 text-center text-sm text-(--text-muted)">No previous days yet.</p>
	{:else}
		<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
			{#each pageDays as day (day)}
				{@const score = scoreFor(day)}
				<a
					href={resolve('/screenshot/[slug]', { slug: day })}
					class="flex flex-col items-center gap-1 rounded-md border-2 border-(--border) bg-(--surface-2) px-3 py-3 text-center transition-colors hover:border-(--accent)"
				>
					<span class="font-medium text-(--text)">{displayDate(day)}</span>
					{#if score?.completed}
						<span class="text-sm font-bold text-(--accent)">{score.score.toLocaleString()} pts</span
						>
					{:else if score}
						<span class="text-xs text-(--text-muted)">In progress</span>
					{/if}
				</a>
			{/each}
		</div>
	{/if}

	{#if pageCount > 1}
		<div class="mt-5 flex items-center justify-center gap-4">
			<button disabled={page === 0} onclick={() => (page -= 1)}>Prev</button>
			<span class="text-sm text-(--text-muted)">Page {page + 1} / {pageCount}</span>
			<button disabled={page >= pageCount - 1} onclick={() => (page += 1)}>Next</button>
		</div>
	{/if}
</div>

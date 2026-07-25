<script lang="ts">
	import { resolve } from '$app/paths';
	import { loadScreenshotAllScores, loadScreenshotDay, type ScreenshotScore } from '$lib/storage';
	import { thumbnailEndpoint } from '$lib/api.svelte';
	import type { ScreenshotProgress } from './[slug]/+page';
	import { onMount } from 'svelte';

	const msPerDay = 86400000;

	function formatDate(d: Date): string {
		const dd = String(d.getUTCDate()).padStart(2, '0');
		const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
		return `${dd}-${mm}-${d.getUTCFullYear()}`;
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
	const today = formatDate(new Date(todayMs));
	const previousDays = Array.from({ length: 50 }, (_, i) =>
		formatDate(new Date(todayMs - (i + 1) * msPerDay))
	);

	const perPage = 20;
	const pageCount = Math.ceil(previousDays.length / perPage);

	let view = $state<'home' | 'previous'>('home');
	let page = $state(0);
	let scoreInfo = $state<ScreenshotScore[] | undefined>();
	let todayProgress = $state<ScreenshotProgress | undefined>();

	const pageDays = $derived(previousDays.slice(page * perPage, (page + 1) * perPage));
	const scoreFor = (day: string) => scoreInfo?.find((s) => s.date === day);
	const todayScore = $derived(todayProgress?.screenshots.reduce((sum, s) => sum + s.score, 0) ?? 0);

	onMount(() => {
		scoreInfo = loadScreenshotAllScores();
		todayProgress = loadScreenshotDay(today);
	});
</script>

<div class="mx-auto w-[90%] max-w-lg py-10">
	{#if view === 'home'}
		<div class="flex flex-col gap-6 text-center">
			<div>
				<h1 class="text-3xl font-bold">Screenshot</h1>
				<p class="mt-1 text-sm text-(--text-muted)">
					Guess random levels from a screenshot with 3 hints. Each hint will deduct points. Try to
					get as many points as possible.
				</p>
			</div>

			<div class="flex flex-col gap-3">
				{#if todayProgress?.completed}
					<div class="rounded-md border border-(--border) bg-(--surface) p-4">
						<div class="pb-2 text-center">
							<h2 class="text-xs font-bold tracking-widest text-(--text-muted) uppercase">
								Today's Score
							</h2>
							<p class="mt-1 text-4xl font-bold text-(--accent)">
								{todayScore.toLocaleString()}
							</p>
						</div>

						<div class="flex flex-col">
							{#each todayProgress.screenshots as s, i (s.level.id)}
								<div class="flex w-full items-center gap-4 py-3 text-left">
									<img
										src={thumbnailEndpoint(s.level.level_id)}
										alt={s.level.name}
										class="h-24 w-16 shrink-0 rounded object-cover"
									/>
									<div class="min-w-0 flex-1">
										<p class="truncate font-medium">
											<span class={s.correct ? 'text-green-500' : 'text-red-500'}
												>{s.level.name}</span
											>
										</p>
										<p class="text-sm text-(--text-muted)">Round {i + 1}</p>
									</div>
									<p
										class={`shrink-0 text-lg font-bold ${s.correct ? 'text-(--accent)' : 'text-(--text-muted)'}`}
									>
										{s.score.toLocaleString()}
									</p>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<a
						href={resolve('/screenshot/[slug]', { slug: today })}
						class="rounded-md bg-(--accent) px-4 py-3 font-semibold text-white transition-colors hover:bg-(--accent-hover)"
					>
						{todayProgress ? 'Continue Today' : 'Play Today'}
					</a>
				{/if}
				<button
					class="rounded-md border border-(--border) bg-(--surface) px-4 py-3 font-semibold transition-colors hover:border-(--accent)"
					onclick={() => (view = 'previous')}
				>
					Play Previous Days
				</button>
			</div>
		</div>
	{:else}
		<div class="mb-5 flex items-center justify-between">
			<button
				class="border-0 bg-transparent px-0 text-sm text-(--text-muted) hover:text-(--text)"
				onclick={() => (view = 'home')}
			>
				← Back
			</button>
			<h1 class="text-lg font-bold">Previous Days</h1>
			<span class="w-12"></span>
		</div>

		<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
			{#each pageDays as day (day)}
				{@const score = scoreFor(day)}
				<a
					href={resolve('/screenshot/[slug]', { slug: day })}
					class="flex flex-col items-center gap-1 rounded-md border border-(--border) bg-(--surface) px-3 py-3 text-center transition-colors hover:border-(--accent)"
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

		{#if pageCount > 1}
			<div class="mt-5 flex items-center justify-center gap-4">
				<button disabled={page === 0} onclick={() => (page -= 1)}>Prev</button>
				<span class="text-sm text-(--text-muted)">Page {page + 1} / {pageCount}</span>
				<button disabled={page >= pageCount - 1} onclick={() => (page += 1)}>Next</button>
			</div>
		{/if}
	{/if}
</div>

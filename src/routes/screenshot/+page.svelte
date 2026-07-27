<script lang="ts">
	import { resolve } from '$app/paths';
	import { loadScreenshotDay } from '$lib/storage';
	import { thumbnailEndpoint } from '$lib/api.svelte';
	import type { ScreenshotProgress } from './[slug]/+page';
	import { onMount } from 'svelte';

	const msPerDay = 86400000;

	function formatDate(d: Date): string {
		const dd = String(d.getUTCDate()).padStart(2, '0');
		const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
		return `${dd}-${mm}-${d.getUTCFullYear()}`;
	}

	const todayMs = Date.now() - (Date.now() % msPerDay);
	const today = formatDate(new Date(todayMs));

	let todayProgress = $state<ScreenshotProgress | undefined>();

	const todayScore = $derived(todayProgress?.screenshots.reduce((sum, s) => sum + s.score, 0) ?? 0);

	onMount(() => {
		todayProgress = loadScreenshotDay(today);
	});
</script>

<div class="mx-auto w-[90%] max-w-lg py-10">
	<div class="flex flex-col gap-6 text-center">
		<div>
			<h1 class="text-3xl font-bold">Screenshot</h1>
			<p class="mt-1 text-sm text-(--text-muted)">
				Guess random levels from a screenshot with 3 hints. Each hint will deduct points. Try to get
				as many points as possible.
			</p>
		</div>

		<div class="flex flex-col gap-3">
			{#if todayProgress?.completed}
				<div class="rounded-md border-2 border-(--border) bg-(--surface) p-4">
					<div class="pb-2 text-center">
						<h2 class="text-xs font-bold tracking-widest text-(--text-muted) uppercase">
							Today's Score
						</h2>
						<p class="mt-1 text-4xl font-bold text-(--accent)">
							{todayScore.toLocaleString()}
						</p>
					</div>

					<div class="flex flex-col gap-2">
						{#each todayProgress.screenshots as s, i (s.level.id)}
							<div
								class="flex w-full items-center gap-4 rounded-md border-2 border-(--border) bg-(--sunken) p-3 text-left"
							>
								<img
									src={thumbnailEndpoint(s.level.level_id)}
									alt={s.level.name}
									class="h-24 w-16 shrink-0 rounded object-cover"
								/>
								<div class="min-w-0 flex-1">
									<p class="truncate font-medium">
										<span class={s.correct ? 'text-green-500' : 'text-red-500'}>{s.level.name}</span
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
			<div class="flex flex-row gap-1">
				<a
					href={resolve('/screenshot/past')}
					class="w-full rounded-md border-2 border-(--border) bg-(--surface-2) px-4 py-3 text-center font-semibold transition-colors hover:border-(--accent)"
				>
					Play Previous Days
				</a>
				<a
					href={resolve('/')}
					class="w-full rounded-md border-2 border-(--border) bg-(--surface-2) px-4 py-3 text-center font-semibold transition-colors hover:border-(--accent)"
				>
					Back
				</a>
			</div>
		</div>
	</div>
</div>

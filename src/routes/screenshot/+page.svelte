<script lang="ts">
	import { resolve } from '$app/paths';
	import { loadScreenshotAllScores, type ScreenshotScore } from '$lib/storage';
    import { onMount } from 'svelte';

    let scoreInfo: ScreenshotScore[] | undefined = $state();
	const days: string[] = ['22-07-2026', '23-07-2026', '24-07-2026', '25-07-2026', '26-07-2026'];

    onMount(() => {
        scoreInfo = loadScreenshotAllScores();
    })
</script>

<div class="mx-auto w-[90%] max-w-lg py-8">
	<h1 class="mb-1 text-2xl font-bold">Past Days</h1>

	<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
		{#each days as day (day)}
			{@const score = scoreInfo?.find((s) => s.date === day)}
			<a
				href={resolve('/screenshot/[slug]', { slug: day })}
				class="flex flex-col items-center gap-1 rounded-md border border-(--border) bg-(--surface) px-3 py-3 text-center font-medium transition-colors hover:border-(--accent)"
			>
				<span class="text-gray-300">{day}</span>
				{#if score?.completed}
					<p>score: <span class="text-sm font-bold text-(--accent)">{score.score}</span></p>
				{:else if score}
					<span class="text-xs text-(--text-muted)">In Progress</span>
				{/if}
			</a>
		{/each}
	</div>
</div>

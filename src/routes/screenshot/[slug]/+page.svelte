<script lang="ts">
	import { thumbnailEndpoint, getAllLevels, allLevelNames } from '$lib/api.svelte';
	import LevelInput from '$lib/components/LevelInput.svelte';
	import { saveScreenshotDay, setScreenshotScoreDay } from '$lib/storage';
	import { onMount, untrack } from 'svelte';
	import { resolve } from '$app/paths';
	let { data } = $props();

	let info = $state(untrack(() => data.info));

	const current = $derived(info.screenshots[info.currentRound]);
	const currentLevel = $derived(current.level);

	const totalRounds = $derived(info.screenshots.length);
	const isLastRound = $derived(info.currentRound >= totalRounds - 1);
	const totalScore = $derived(info.screenshots.reduce((sum, s) => sum + s.score, 0));

	$effect(() => {
		saveScreenshotDay(data.dateString, $state.snapshot(info));
		setScreenshotScoreDay(data.dateString, {
			date: data.dateString,
			completed: info.completed,
			progress: info.currentRound,
			score: totalScore
		});
	});

	function handleGuess(value: string) {
		complete(value.toLowerCase() === currentLevel.name.toLowerCase());
	}

	const totalHints = 3;
	const maxPoints = 10000;
	const pointDeduction = 2500;

	const revealed = $derived(current.completed ? totalHints : current.hintsUnlocked);

	const zoomClass = () => (revealed === 0 ? 'scale-[3]' : '');
	const blurClass = () => (revealed < 2 ? 'blur-md' : '');
	const showName = () => revealed >= 3;

	function unlockHint(n: number) {
		if (n === current.hintsUnlocked + 1) current.hintsUnlocked = n;
	}

	function createNameHint() {
		const words = currentLevel.name.split(' ');
		return words.map((word: string) => word.charAt(0) + '_'.repeat(word.length - 1)).join(' ');
	}

	function complete(isCorrect: boolean) {
		current.correct = isCorrect;
		current.score = isCorrect ? maxPoints - current.hintsUnlocked * pointDeduction : 0;
		current.completed = true;
	}

	function nextRound() {
		if (isLastRound) {
			info.totalScore = totalScore;
			info.completed = true;
		} else {
			info.currentRound++;
		}
	}

	onMount(async () => {
		if (allLevelNames.names.length === 0) await getAllLevels(fetch);

		for (const s of info.screenshots) {
			const img = new Image();
			img.src = thumbnailEndpoint(s.level.level_id);
		}
	});
</script>

<div class="mx-auto w-[90%] rounded-md border border-(--border) bg-(--surface) p-4">
	{#if info.completed}
		<div class="py-6 text-center">
			<h1 class="text-xs font-bold tracking-widest text-(--text-muted) uppercase">Final Score</h1>
			<p class="mt-1 text-5xl font-bold text-(--accent)">{totalScore.toLocaleString()}</p>
		</div>

		<div class="flex flex-col">
			{#each info.screenshots as s, i (s.level.id)}
				<div class="flex w-full items-center gap-4 py-3">
					<img
						src={thumbnailEndpoint(s.level.level_id)}
						alt={s.level.name}
						class="h-24 w-16 shrink-0 rounded object-cover"
					/>
					<div class="min-w-0 flex-1">
						<p class="truncate font-medium">
							<span class={s.correct ? 'text-green-500' : 'text-red-500'}>{s.level.name}</span>
						</p>
						<p class="text-sm text-(--muted)">
							Round {i + 1}
						</p>
					</div>
					<p
						class={`shrink-0 text-lg font-bold ${s.correct ? 'text-(--accent)' : 'text-(--text-muted)'}`}
					>
						{s.score.toLocaleString()}
					</p>
				</div>
			{/each}
		</div>
		<br />
		<a
			href={resolve('/screenshot/')}
			class="mx-auto block w-fit rounded-md border border-(--border) bg-(--surface) px-3 py-3 text-center font-medium transition-colors hover:border-(--accent)"
		>
			Return
		</a>
	{:else}
		<h2 class="mb-1 text-center text-2xl font-bold tracking-wide">
			Round {info.currentRound + 1}
		</h2>

		<div class={`${blurClass()} w-fit overflow-hidden rounded-md`}>
			<img
				src={thumbnailEndpoint(currentLevel.level_id)}
				alt="level thumbnail"
				class={`${zoomClass()} block max-w-full origin-center`}
			/>
		</div>

		<div class="mt-4 flex flex-row justify-center gap-2">
			{#each { length: totalHints }, i}
				<button
					class={!current.completed && i + 1 === current.hintsUnlocked + 1 ? 'primary' : ''}
					disabled={current.completed || i + 1 !== current.hintsUnlocked + 1}
					onclick={() => unlockHint(i + 1)}
				>
					{i + 1 <= revealed ? 'Unlocked' : `Unlock Hint ${i + 1}`}
				</button>
			{/each}
		</div>

		{#if showName()}
			<h1
				class={`mt-6 text-center text-2xl font-bold ${!current.completed ? 'tracking-[0.25em]' : ''}`}
			>
				{!current.completed ? createNameHint() : currentLevel.name}
			</h1>
		{/if}

		{#if !current.completed}
			<div class="mt-4">
				<LevelInput names={allLevelNames.names} onsubmit={handleGuess} />
			</div>
		{:else}
			<p class="text-center font-bold text-(--accent)">{current.score} points</p>
			<div class="mt-3 flex justify-center">
				<button class="primary" onclick={nextRound}>
					{isLastRound ? 'Show Final Score' : 'Next Round'}
				</button>
			</div>
		{/if}
	{/if}
</div>

<!-- {#each data.levels as l (l.name)}
    <p>{l.name}</p>
    <img src={thumbnailEndpoint(l.level_id)} alt={l.name} />
{/each} -->

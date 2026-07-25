<script lang="ts">
	import { thumbnailEndpoint, getAllLevels, type Level, allLevelNames } from '$lib/api.svelte';
	import LevelInput from '$lib/components/LevelInput.svelte';
	import { onMount } from 'svelte';
	let { data } = $props();

	let hintsUnlocked = $state(0);
	let currentLevel: Level | undefined = $state(undefined);
	let completed = $state(false);
	let correct = $state(false);
	let displayHintsUnlocked = $state(false);

	// value is already a valid level name (validated in LevelInput)
	function handleGuess(value: string) {
		if (!currentLevel) return;
		complete(value.toLowerCase() === currentLevel.name.toLowerCase());
	}

	const totalHints = 3;
	const maxPoints = 10000;
	const pointDeduction = 2500;

	const zoomClass = () => (hintsUnlocked === 0 ? 'scale-[3]' : '');
	const blurClass = () => (hintsUnlocked < 2 ? 'blur-md' : '');
	const showName = () => hintsUnlocked >= 3;

	const calculatePoints = () =>
		correct ? maxPoints - (displayHintsUnlocked ? 0 : hintsUnlocked * pointDeduction) : 0;

	function unlockHint(n: number) {
		if (n === hintsUnlocked + 1) hintsUnlocked = n;
	}

	function createNameHint() {
		if (!currentLevel) return '';

		const words = currentLevel.name.split(' ');
		return words.map((word: string) => word.charAt(0) + '_'.repeat(word.length - 1)).join(' ');
	}

	function complete(isCorrect: boolean) {
		correct = isCorrect;
		displayHintsUnlocked = true;
		hintsUnlocked = 3;
		completed = true;
	}

	onMount(async () => {
		if (data.levels) {
			currentLevel = data.levels[0];
		}
		// load the full name list into the client so the autocomplete has data
		if (allLevelNames.names.length === 0) await getAllLevels(fetch);
	});
</script>

{#if currentLevel}
	<div class="mx-auto w-[90%] rounded-md bg-black p-4">
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
					class={i + 1 === hintsUnlocked + 1 ? 'primary' : ''}
					disabled={i + 1 !== hintsUnlocked + 1}
					onclick={() => unlockHint(i + 1)}
				>
					{i + 1 <= hintsUnlocked ? 'Unlocked' : `Unlock Hint ${i + 1}`}
				</button>
			{/each}
		</div>

		{#if showName()}
			<h1 class={`mt-6 text-center text-2xl font-bold ${!completed ? 'tracking-[0.25em]' : ''}`}>
				{!completed ? createNameHint() : currentLevel.name}
			</h1>
		{/if}

		{#if !completed}
			<div class="mt-4">
				<LevelInput names={allLevelNames.names} onsubmit={handleGuess} />
			</div>
		{:else}
			<p class="text-center font-bold text-(--accent)">{calculatePoints()} points</p>
		{/if}
	</div>
{/if}

<!-- {#each data.levels as l (l.name)}
    <p>{l.name}</p>
    <img src={thumbnailEndpoint(l.level_id)} alt={l.name} />
{/each} -->

<script lang="ts">
	interface Props {
		names: string[];
		placeholder?: string;
		max?: number;
		onsubmit: (value: string) => void;
	}

	let { names, placeholder = 'Guess the level...', max = 10, onsubmit }: Props = $props();

	let value = $state('');
	let focused = $state(false);
	let error = $state('');

	const suggestions = $derived.by(() => {
		const q = value.toLowerCase();
		if (!q) return [];
		return names.filter((n) => n.toLowerCase().startsWith(q)).slice(0, max);
	});

	const open = $derived(focused && suggestions.length > 0);

	function pick(name: string) {
		value = name;
		focused = false;
		error = '';
	}

	function submit() {
		const match = names.find((n) => n.toLowerCase() === value.toLowerCase());
		if (!match) {
			error = 'Please enter a valid name';
			return;
		}
		error = '';
		onsubmit(match);
		value = '';
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			submit();
		} else if (e.key === 'Escape') {
			focused = false;
		}
	}
</script>

<div class="flex w-full gap-2">
	<div class="relative flex-1">
		<input
			type="text"
			bind:value
			{placeholder}
			oninput={() => {
				error = '';
				focused = true;
			}}
			onfocus={() => (focused = true)}
			onblur={() => (focused = false)}
			onkeydown={onKeydown}
			class="w-full rounded-md border border-(--border) bg-(--surface-2) px-3 py-2 text-(--text) outline-none focus:border-(--accent)"
		/>

		{#if open}
			<ul
				class="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-(--border) bg-(--surface) py-1 shadow-lg"
			>
				{#each suggestions as name (name)}
					<li>
						<button
							type="button"
							class="block w-full border-0 bg-transparent px-3 py-1.5 text-left hover:bg-(--surface-2)"
							onmousedown={(e) => {
								e.preventDefault();
								pick(name);
							}}
						>
							{name}
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<button type="button" class="primary" onclick={submit}>Guess</button>
</div>

{#if error}
	<p class="mt-2 text-sm text-(--accent)">{error}</p>
{/if}

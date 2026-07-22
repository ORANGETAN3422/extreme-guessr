<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<header class="app-header">
	<h1>Extreme Guessr</h1>
	<span class="tag">daily rounds</span>
</header>

<main class="app-main">
	{@render children()}
</main>

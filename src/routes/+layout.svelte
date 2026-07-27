<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/extreme-demon.png';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let { children } = $props();

	const links = [
		{ label: 'Home', href: resolve('/') },
		{ label: 'Screenshot', href: resolve('/screenshot/') }
	];

	const isActive = (href: string) =>
		href === resolve('/') ? page.url.pathname === href : page.url.pathname.startsWith(href);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Extreme Guessr</title>
</svelte:head>

<header class="app-header">
	<a href={resolve('/')} class="brand">Extreme Guessr</a>
	<nav class="app-nav">
		{#each links as link (link.href)}
			<a href={link.href} class="nav-link" class:active={isActive(link.href)}>
				{link.label}
			</a>
		{/each}
	</nav>
</header>

<main class="app-main">
	{@render children()}
</main>

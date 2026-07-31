<script lang="ts">
	import './layout.css';
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
	<title>Extreme Guessr</title>
	<meta
		name="description"
		content="Guess the extreme demons from images. 3 new levels every day."
	/>
	<meta name="theme-color" content="#ed7a34" />

	<meta property="og:type" content="website" />
	<meta property="og:title" content="Extreme Guessr" />
	<meta
		property="og:description"
		content="Guess the extreme demons from images. 3 new levels every day."
	/>
	<meta property="og:url" content="https://orangetan3422.github.io/extreme-guessr/" />
	<meta
		property="og:image"
		content="https://orangetan3422.github.io/extreme-guessr/extreme-demon.png"
	/>
</svelte:head>

<header class="app-header">
	<img
		src="https://orangetan3422.github.io/extreme-guessr/extreme-demon.png"
		alt=""
		class="h-[2em] w-auto"
	/>
	<a href={resolve('/')} class="brand -ml-2">Extreme Guessr</a>
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

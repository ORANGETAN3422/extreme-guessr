<script lang="ts">
	import { resolve } from '$app/paths';

	const thinking_space_by_hidekix_verified_by_atomic_legendary_extreme_demon = 54953085;
	const theOtherLEvels = [63996127, 94156085, 68353244, 81139702, 86595871, 137400971];
	theOtherLEvels.push(thinking_space_by_hidekix_verified_by_atomic_legendary_extreme_demon);

	function randomThumb() {
		let r = Math.floor(Math.random() * theOtherLEvels.length);
		return theOtherLEvels[r];
	}
</script>

<div class="mx-auto flex w-[90%] max-w-2xl flex-col gap-4 py-10">
	<div class="text-center">
		<h1 class="text-4xl font-bold">Extreme Guessr</h1>
		<p class="mx-auto mt-2 max-w-xl text-(--text-muted)">New levels at midnight UTC</p>
	</div>

	<a
		href={resolve('/screenshot/')}
		class="group relative flex overflow-hidden rounded-lg border-2 border-(--border) bg-(--surface) transition-colors hover:border-(--accent)"
	>
		<div class="relative z-10 flex flex-1 flex-col gap-2 p-6">
			<h2 class="text-xl font-semibold text-(--text) group-hover:text-(--accent)">Screenshot</h2>
			<p class="max-w-md text-sm text-(--text-muted)">
				Guess random levels from a screenshot with 3 hints. Each hint will deduct points. Try to get
				as many points as possible.
			</p>
			<span class="mt-2 text-sm font-semibold text-(--accent)">Play ></span>
		</div>
		<img
			src={`https://levelthumbs.prevter.me/thumbnail/${randomThumb()}/small`}
			alt=""
			class="pointer-events-none absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-25"
			style="mask-image: linear-gradient(to right, transparent, black 60%); -webkit-mask-image: linear-gradient(to right, transparent, black 60%);"
		/>
	</a>

	<div class="rounded-lg border-2 border-(--border) bg-(--surface) p-6">
		<div class="flex items-start justify-between">
			<h2 class="text-xl font-semibold text-(--text)">Credits</h2>
			<div class="flex flex-col items-end gap-2">
				<a
					href="https://github.com/ORANGETAN3422/extreme-guessr"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--accent-hover)"
				>
					<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" class="h-5 w-5">
						<path
							d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
						/>
					</svg>
					<span>Github Repo</span>
				</a>
				<a
					href="https://orangetan3422.github.io/projects"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--accent-hover)"
				>
					<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" class="h-5 w-5">
						<mask id="cubeCheck">
							<rect width="16" height="16" fill="white" />
							<rect x="1" y="1" width="3.5" height="3.5" fill="black" />
							<rect x="8" y="1" width="3.5" height="3.5" fill="black" />
							<rect x="4.5" y="4.5" width="3.5" height="3.5" fill="black" />
							<rect x="11.5" y="4.5" width="3.5" height="3.5" fill="black" />
							<rect x="1" y="8" width="3.5" height="3.5" fill="black" />
							<rect x="8" y="8" width="3.5" height="3.5" fill="black" />
							<rect x="4.5" y="11.5" width="3.5" height="3.5" fill="black" />
							<rect x="11.5" y="11.5" width="3.5" height="3.5" fill="black" />
						</mask>
						<rect width="16" height="16" rx="2" mask="url(#cubeCheck)" />
					</svg>
					<span>More of my stuff</span>
				</a>
			</div>
		</div>
		<p class="mt-1 text-sm text-(--text-muted)">
			Made by <span class="font-semibold text-(--text)">Orangetan</span>
		</p>
		<dl class="mt-4 flex flex-col gap-4">
			<div>
				<dt class="text-xs font-semibold tracking-wide text-(--text-muted)">Inspiration</dt>
				<dd class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
					<a class="hover:text-(--accent-hover)" href="https://framed.wtf/">Framed</a>
					<a class="hover:text-(--accent-hover)" href="https://aniguessr.com/">Aniguessr</a>
				</dd>
			</div>

			<div>
				<dt class="text-xs font-semibold tracking-wide text-(--text-muted)">Level data & API</dt>
				<dd class="mt-1 text-sm">
					<a class="hover:text-(--accent-hover)" href="https://aredl.net/">AREDL</a>
				</dd>
			</div>

			<div>
				<dt class="text-xs font-semibold tracking-wide text-(--text-muted)">
					Thumbnails & screenshots
				</dt>
				<dd class="mt-1 text-sm">
					<a class="hover:text-(--accent-hover)" href="https://levelthumbs.prevter.me/">
						Level Thumbnails mod by cdc &amp; prevter
					</a>
				</dd>
			</div>
		</dl>
	</div>
</div>

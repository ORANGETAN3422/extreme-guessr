<script lang="ts">
	import { chooseTodayLevels } from '$lib/rng';

	async function hi() {
		console.log(await chooseTodayLevels());
	}

	hi();
</script>

<div class="card">
	<p>Three levels are picked fresh each day. Same for everyone, until midnight UTC.</p>
	<button class="primary">Start today's round</button>
</div>

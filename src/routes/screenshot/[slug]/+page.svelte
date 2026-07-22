<script lang="ts">
    import { thumbnailEndpoint } from "$lib/api";

    let {data} = $props();
</script>

<h1>{data.date}</h1>
<br />
{#each data.levels as l (l.name)}
    <p>{l.name}</p>
    <img src={thumbnailEndpoint(l.level_id)} alt={l.name} />
{/each}

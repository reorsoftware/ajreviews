<script lang="ts">
    import {current, goto} from "./shared.svelte"
    import WineList from "./WineList.svelte";
    import CreateWine from "./CreateWine.svelte";

    let current_page = $derived(current())
</script>

{#if current_page === ""}
    <WineList/>
{:else if current_page === "create-wine"}
    <CreateWine/>
{:else}
    <div>
        <img src="https://cdn.prod.website-files.com/5d5e2ff58f10c53dcffd8683/5d73852f7a6dfa5b3e1e829f_clumsy.svg" alt="not found"/>
    </div>
{/if}
<script lang="ts">
    import {ThumbsDown, ThumbsUp, Search, Plus} from "@lucide/svelte";
    import WineView from "./WineView.svelte";
    import {onMount} from "svelte";
    import {supabase} from "../supabaseClient";
    import {goto} from "./shared.svelte";
    import BikiniMan from "../opendoodles/BikiniMan.svelte";

    interface Wine {
        id: string;
        name: string;
        country: string;
        is_good: boolean;
    }

    let wine_id: string | null = $state("")
    let wine_search = $state("")
    let list_error = $state(false)
    const wine_search_lower = $derived(wine_search.toLowerCase())

    let wine_list: Wine[] = $state([])
    const wine_list_filtered: Wine[] = $derived(wine_search !== null ? wine_list.filter(wine => wine.name.toLowerCase().includes(wine_search)) : wine_list)

    onMount(async () => {
        const { data, error, status } = await supabase.from('wines').select('id, name, country, is_good').order('name', {ascending: true}).range(0, 100);
        if (error) {
            $inspect(error);
            list_error = true;
            wine_list = [
                {id: "1", name: "Wine 1", country: "Australia", is_good: true},
                {id: "2", name: "Wine 2", country: "Argentina", is_good: false},
            ]
        } else {
            wine_list = data
        }

    })

    const back = async () => {
        wine_id = null
    };


</script>

{#snippet positive()}
    <span class="text-success">
        <ThumbsUp/>
    </span>
{/snippet}
{#snippet negative()}
    <span class="text-danger">
        <ThumbsDown/>
    </span>
{/snippet}

<div id="wine-viewer">
    {#if wine_id}
        <button class="btn btn-outline-primary" onclick={back}>Back to wines...</button>
        <WineView wine_id={wine_id}/>
    {:else}
        {#if list_error}
            <div class="alert alert-danger mt-3">
                Something went wrong fetching the wine list... displaying example data
            </div>
        {/if}
        <div class="input-group">
            <span class="input-group-text"><Search/></span>
            <input type="text" name="wine-name" placeholder="Wine name..." class="form-control" bind:value={wine_search}>
        </div>


        <table class="table table-hover">
            <colgroup>
                <col span="1" style="width: 3rem">
                <col span="1" style="width: 1fr">
                <col span="1" style="width: 10rem">
            </colgroup>
            <thead>
            <tr>
                <th>
                    <span class="visually-hidden">Sentiment</span>
                    <button aria-hidden="true" class="btn btn-sm btn-success" onclick={() => goto("create-wine")}>
                        <Plus/>
                    </button>
                <th>Wine</th>
                <th>Country</th>
            </tr>
            </thead>
            <tbody>
            {#each wine_list_filtered as wine_item}
                <tr>
                    {#if wine_item.is_good}
                        <td>{@render positive()}</td>
                    {:else}
                        <td>{@render negative()}</td>
                    {/if}
                    <td><a href="#" onclick={() => wine_id = wine_item.id}>{wine_item.name}</a></td>
                    <td>{wine_item.country}</td>
                </tr>
            {/each}
            </tbody>
        </table>
        <BikiniMan class="opacity-25 w-100 mt-5"/>
    {/if}
</div>



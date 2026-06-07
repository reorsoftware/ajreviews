<script lang="ts">
    import {onMount} from "svelte";
    import {supabase} from "../supabaseClient";
    import {ThumbsDown, ThumbsUp} from "@lucide/svelte";

    interface WineViewProps {
        wine_id: string
    }

    interface WineView {
        name: string,
        country: string,
        is_good: boolean,
        image_data_uri: string,
        type: string,
    }

    let {wine_id}: WineViewProps = $props();
    let wine: WineView | null = $state<WineView | null>(null);
    let wine_sentiment_class: string = $derived(wine !== null
        ? wine.is_good
            ? "border-success"
            : "border-danger"
        : "border")

    let error_msg = $state("");
    let loading = $state(false);

    onMount(async () => {
        loading = true;

        let debounce = sleep(500);
        let query = await supabase.from('wines').select('name, country, is_good, image_data_uri, type').eq('id', wine_id).single();

        await Promise.all([debounce, query]);

        let {data, error, status} = query;
        if (data !== null) {
            wine = data;
        }

        loading = false;
    })

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
</script>

{#if loading}
    <div class="d-flex justify-content-center align-items-center" style="height: 50vh;">
        <span class="spinner-border spinner-border" role="status" aria-hidden="true"></span>
    </div>

{:else if wine}
    <div>
        <input
                id="wine-name"
                class="form-control"
                type="text"
                bind:value={wine.name}
                readonly
        />
    </div>
    <div class="mt-3">
        <input
                id="wine-country"
                class="form-control"
                type="text"
                bind:value={wine.country}
                readonly
        />
    </div>
    <div class="mt-3">
        <input
                id="wine-country"
                class="form-control"
                type="text"
                bind:value={wine.type}
                readonly
                placeholder="WINE TYPE WOULD GO HERE"
        />
    </div>
    <div class="mt-3 d-flex justify-content-center gap-3">
        <div class="card {wine_sentiment_class} border-4 d-inline-flex" style="aspect-ratio: 0.5; width: 70vw; max-height: 70vh;">
            <div class="card-body p-0">
                <img src="{wine.image_data_uri}" alt="bottle" class="w-100">
            </div>
        </div>
    </div>
    {#if error_msg}
        <div class="alert alert-danger mt-3">
            {error_msg}
        </div>
    {/if}
{:else}
    <div class="alert alert-danger mt-3">
        Failed to load the wine info :(
    </div>
{/if}
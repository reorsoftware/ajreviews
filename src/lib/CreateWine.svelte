<script lang="ts">
    import { ThumbsUp, ThumbsDown } from "@lucide/svelte";
    import {goto} from "./shared.svelte";
    import {removeBackground} from "@imgly/background-removal";
    import {supabase} from "../supabaseClient";

    let wine_name = $state("");
    let country = $state("");
    let saving = $state(false);
    let wine_is_good = $state(true);
    let wine_type = $state("");
    let error_msg = $state("");


    let inputElement: HTMLInputElement;
    let imageElement: HTMLImageElement;
    let imageElementBg: HTMLImageElement;
    let showImage = $state(false);

    let sentimentGoodClass = $derived(wine_is_good ? "btn-success" : "btn-outline-success");
    let sentimentBadClass = $derived(wine_is_good ? "btn-outline-danger" : "btn-danger");

    async function onImageChanged() {
        const file = inputElement.files?.[0];

        if (file) {


            const imgReader = new FileReader();
            imgReader.addEventListener("load", function () {
                if (typeof imgReader.result === "string") {
                    imageElement.setAttribute("src", imgReader.result);
                }
            });
            const bglessReader = new FileReader();
            imgReader.addEventListener("load", function () {
                if (typeof bglessReader.result === "string") {
                    imageElementBg.setAttribute("src", bglessReader.result);
                }
            });

            const bgless = await removeBackground(file)
            showImage = true;

            imgReader.readAsDataURL(file);
            bglessReader.readAsDataURL(bgless);

            return;
        }
        showImage = false;
    }

    const setSentiment = (is_good: boolean) => {
        wine_is_good = is_good;
    }

    const handleSubmit = async () => {
        saving = true;
        try {
            let {data, error} = await supabase.auth.getUser();
            let me = data.user?.id
            await supabase.from("wines").insert({name: wine_name, country, image_data_uri: imageElementBg.src, is_good: wine_is_good, created_by: me, type: wine_type})
        } catch (error) {

        }

        saving = false;
        goto("");
    }
</script>

<h1 class="text-center">New wine review</h1>

<button class="btn btn-outline-primary" onclick={() => goto("")}>Back to wines...</button>
<form class="form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <div>
        <label for="wine-name" class="form-label">Wine Name</label>
        <input
                id="wine-name"
                class="form-control"
                type="text"
                placeholder="The name of the wine..."
                bind:value={wine_name}
        />
    </div>
    <div class="mt-3">
        <label for="wine-country" class="form-label">Country</label>
        <input
                id="wine-country"
                class="form-control"
                type="text"
                placeholder="Where it came from..."
                bind:value={country}
        />
    </div>
    <div class="mt-3">
        <label for="wine-type" class="form-label">Type</label>
        <input
                id="wine-country"
                class="form-control"
                type="text"
                placeholder="What type of wine is it? Chardonnay? Sauvignon? ...?"
                bind:value={wine_type}
        />
    </div>
    <div class="mt-3">
        <label for="wine-picture" class="form-label">Bottle</label>
        <input
                bind:this={inputElement}
                onchange={onImageChanged}
                id="wine-picture"
                class="form-control"
                type="file"
                placeholder="A piccy please"
        />
    </div>
    <div class="mt-3 d-flex justify-content-center gap-3">
        <div class="card d-inline-flex" style="aspect-ratio: 0.5; width: 35vw; max-height: 50vh;">
            <div class="card-body">
                {#if showImage}
                    <img src="" bind:this={imageElement} alt="bottle" class="w-100">
                {:else}
                    <span>Bottle Preview</span>
                {/if}
            </div>
        </div>
        <div class="card d-inline-flex border-0 " style="aspect-ratio: 0.1; width: 20vw; max-height: 50vh;">
            <div class="card-body d-flex flex-column justify-content-between gap-3 p-0">
                <button class="btn {sentimentGoodClass} w-100"
                        style="height: 50%"
                        type="button"
                        onclick={() => setSentiment(true)}
                >
                    <ThumbsUp/>
                </button>
                <button class="btn {sentimentBadClass} w-100"
                        style="height: 50%"
                        type="button"
                        onclick={() => setSentiment(false)}
                >
                    <ThumbsDown/>
                </button>
            </div>
        </div>
        <div class="card d-inline-flex" style="aspect-ratio: 0.5; width: 35vw; max-height: 50vh;">
            <div class="card-body">
                {#if showImage}
                    <img src="" bind:this={imageElementBg} alt="bottle without background" class="w-100">
                {:else}
                    <span>Bottle (no background)</span>
                {/if}
            </div>
        </div>
    </div>
    <div class="mt-3">
        <div class="d-flex justify-content-center gap-3">
            <button
                    type="submit"
                    class="btn btn-success px-5"
                    aria-live="polite"
                    disabled={saving}
            >
                {#if saving}
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {:else}
                    <span>Create</span>
                {/if}
            </button>
        </div>
    </div>
    {#if error_msg}
        <div class="alert alert-danger mt-3">
            {error_msg}
        </div>
    {/if}

</form>
<script lang="ts">
    import {supabase} from "../supabaseClient";
    import {onMount} from "svelte";
    import {AuthError} from "@supabase/supabase-js";

    let mode: "signup" | "signin" | null = $state(null);
    let loading = $state(false);
    let email = $state("");
    let password = $state("");
    let error_msg: string | null = $state(null);

    // onMount(async () => {
    //     try {
    //         const {data, error} = await supabase.auth.signInWithPasskey();
    //     } catch {
    //
    //     }
    // })

    const handleSubmit = async () => {
        loading = true;

        if (mode === "signin") {
            await handleSignin();
        } else if (mode === "signup") {
            await handleSignup();
        }

        loading = false;
    }
    const handleSignup = async () => {
        try {
            const {data, error} = await supabase.auth.signUp({email, password})
            if (error) throw error;
        } catch (error) {
            $inspect(error).with(console.trace)
            error_msg = error instanceof Error ? error.message : "Unknown error";
        }



    }

    const handleSignin = async () => {


        try {
            const {data, error} = await supabase.auth.signInWithPassword({email, password})
            if (error) throw error;

        } catch (error) {
            $inspect(error).with(console.trace)
            error_msg = error instanceof Error ? error.message : "Unknown error";
        }

        loading = false;
    };

    const startSignin = async () => {
        mode = "signin";
        password = "";

        try {
            const {data, error} = await supabase.auth.signInWithPasskey();
        } catch {

        }
    }

    const startSignup = async () => {
        mode = "signup";
        password = "";
    }
</script>

<div class="card">
    <div class="card-body">
        {#if !mode}
            <button class="btn btn-primary d-block mx-auto" onclick={startSignin}>Login</button>
            <button class="btn btn-secondary d-block mx-auto mt-2" onclick={startSignup}>Register</button>
        {:else}
            <form class="form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div>
                    <label for="email" class="form-label">Email</label>
                    <input
                            id="email"
                            class="form-control"
                            type="email"
                            placeholder="Your email"
                            bind:value={email}
                    />
                </div>
                <div class="mt-3">
                    <label for="password" class="form-label">Password</label>
                    <input
                            id="password"
                            class="form-control"
                            type="password"
                            placeholder="Your password"
                            bind:value={password}
                    />
                </div>
                <div class="mt-3">
                    <div class="d-flex justify-content-center gap-3">


                        <button
                                type="button"
                                class="btn btn-outline-danger px-5"
                                aria-live="polite"
                                onclick="{() => mode = null}"
                        >
                            Cancel
                        </button>
                        <button
                                type="submit"
                                class="btn btn-success px-5"
                                aria-live="polite"
                                disabled={loading}
                        >
                            {#if loading}
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            {:else if mode === "signup"}
                                <span>Register</span>
                            {:else if mode === "signin"}
                                <span>Login</span>
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
        {/if}
    </div>
</div>
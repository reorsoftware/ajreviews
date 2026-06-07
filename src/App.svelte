<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from './assets/vite.svg'
  import heroImg from './assets/hero.png'
  import Counter from './lib/Counter.svelte'
  import {supabase} from "./supabaseClient.js";
  import {onMount} from "svelte";
  import Auth from './lib/Auth.svelte'
  import type { AuthSession } from '@supabase/supabase-js'
  import WineList from "./lib/WineList.svelte";
  import Router from "./lib/Router.svelte";

  let session = $state<AuthSession | null>(null)

  onMount(() => {
    supabase.auth.getSession().then(({ data }) => {
      session = data.session
    })
    supabase.auth.onAuthStateChange((_event, _session) => {
      session = _session
    })
  })
</script>

<section id="center">
  <div>
    <h1 class="display-1 text-center">AJ Reviews</h1>
  </div>
  {#if !session}
    <Auth />
  {:else}
    <Router/>
  {/if}
</section>


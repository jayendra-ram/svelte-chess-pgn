<script>
  import { writable } from "svelte/store";
  import { Chess } from "chess.js";
  import { onMount, afterUpdate } from 'svelte';

  let chess = new Chess();

  export let history = [];
  export let handleMove;
  export let handleUndo;
  export let handleRedo;
  export let currentIndex;
  
  function displayMove(move,index) { 
    if (index % 2 == 0) {
      return parseInt(index/2)+1 + ". " + move.san;
    }
    else{
      return move.san;
    }
  }
  let moveRefs = [];

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    }
    scrollToSelectedMove();
  });

  afterUpdate(() => {

    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    }
    scrollToSelectedMove();
  });

  function handleGlobalKeyDown(event) {
    if (event.key === 'ArrowLeft') {
      handleUndo();
    }
    if (event.key === 'ArrowRight') {
      handleRedo();
    }
  }

  function scrollToSelectedMove() {
    if (moveRefs[currentIndex]) {
      moveRefs[currentIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }
  
</script>

<style>
  .move-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    width: 100%;
    max-width: 180px;
    max-height: 370px;
    overflow-y: auto;
    padding: 8px;
    border: 1px solid #ccc;
    background-color: #f8f8f8;
  }

  
  .almost-invisible {
    background-color: rgba(255, 255, 255, 0.1); /* adjust opacity as needed */
    border: 1px solid rgba(255, 255, 255, 0.2); /* adjust opacity as needed */
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
  }
  .almost-invisible-on {
    background-color: #e8e8e8;
    border: 1px solid rgba(255, 255, 255, 0.2); /* adjust opacity as needed */
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
  }
  .almost-invisible:hover {
    background-color: #e8e8e8;
  }

</style>

<div>
  {#if history != []}
    <div class="move-list">
      {#each history as move, index}
          {#if index == currentIndex}
            <button bind:this={moveRefs[index]} class="almost-invisible-on" on:click={() => { handleMove(index, history); scrollToSelectedMove(); }}>{displayMove(move, index)} </button>
          {:else}
            <button bind:this={moveRefs[index]} class="almost-invisible" on:click={() => { handleMove(index, history); scrollToSelectedMove(); }}>{displayMove(move, index)} </button>
          {/if}
      {/each}
    </div>
  {/if}
  <button on:click={handleUndo}> prev </button>
  <button on:click={handleRedo}> next</button>
</div>

<script lang="ts">
  import { Layer } from 'svelte-canvas'
	import {squareSize} from './chess.js'
  const light = '#eed4ac'
  const dark = '#ac7d58'
	
  $: render = ({ context }) => {
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        context.fillStyle = (i + j) % 2 ? dark : light
        context.fillRect(i * squareSize, 0 + j * squareSize, squareSize, squareSize)
      }
    }
  }
</script>

<Layer {render} />

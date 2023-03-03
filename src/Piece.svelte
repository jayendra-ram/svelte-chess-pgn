<script context="module">
  const images = {
    'K': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
    'Q': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
    'R': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
    'B': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
    'N': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
    'P': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
    'k': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
    'q': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
    'r': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
    'b': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
    'n': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
    'p': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
    '_' : ''
  }
	
	// Preload images
  for (const name in images) {
    (new Image()).src = images[name]
  }
</script>

<script>
  import { Layer } from 'svelte-canvas'
	import {squareSize} from './chess.js'

  export let name, file, rank

  const image = new Image(squareSize, squareSize)
  image.src = images[name]

  $: render = ({ context }) => context.drawImage(image, file * squareSize, rank * squareSize, squareSize, squareSize)
</script>

<Layer {render} />

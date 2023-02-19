function for pieces to FEN
<!-- 
<FEN> ::=  <Piece Placement>
       ' ' <Side to move>
       ' ' <Castling ability>
       ' ' <En passant target square>
       ' ' <Halfmove clock>
       ' ' <Fullmove counter>
-->

<script>
  import { Canvas } from 'svelte-canvas'
  import Board from './Board.svelte'
  import Piece from './Piece.svelte'
	import {start,pieces} from './chess.js'
	
	const width = 800, height = 800

	console.log(pieces)
</script>

<Canvas {width} {height}>
	<Board />
	{#each pieces as [name, file, rank]}
		<Piece {name} {file} {rank} />
	{/each}
</Canvas>

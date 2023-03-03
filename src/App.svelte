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
	import {start,pieces,board} from './chess.js'
	
	const width = 800, height = 800

</script>

function for pieces to FEN

{board[0].name}
{board[0].rank}
{board[0].file}

<Canvas {width} {height}>
	<Board />
  <Board />
	{#each board as [name, rank, file]}
		<Piece {name} {file} {rank} />
	{/each}

</Canvas>

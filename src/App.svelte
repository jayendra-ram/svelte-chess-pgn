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
	import {start,pieces, FENtoBoard} from './chess.js'
  const default_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  const test_FEN = '5r2/8/1R6/ppk3p1/2N3P1/P4b2/1K6/5B2 w - - 0 1' 
  let board = FENtoBoard(test_FEN)
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

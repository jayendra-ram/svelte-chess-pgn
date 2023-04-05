<script>

    const startingPositionFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    let fen = "";

    let board = fenToBoard(startingPositionFEN);    
    import Piece from './Piece.svelte'
    import { Canvas } from 'svelte-canvas'
    import {Chess} from "chess.js";
    import * as util from "board.js";

    let chess = new Chess();

    let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let numbers = [8, 7, 6, 5, 4, 3, 2, 1];

    let pgn = "";
    


  </script>
  
  <style>
    .board {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: repeat(8, 1fr);
      width: 400px;
      height: 400px;
      border: 1px solid black;
    }
  
    .cell {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border: 1px solid black;
    }
  
    .black {
      background-color: #b58863;
    }
  
    .white {
      background-color: #f0d9b5;
    }
  </style>
  
<input bind:value={util.fen} placeholder="Enter FEN" />
<button on:click={util.loadFEN}>Load FEN</button>
  

<input bind:value={util.pgn} placeholder="Enter PGN" />
<button on:click={util.loadPGN}>Load PGN</button>

<div class="board">
    {#each numbers as number, row}
      {#each letters as letter, col}
        <div
          class="cell {col % 2 === row % 2 ? 'white' : 'black'}"
          data-coordinate="{letter}{number}"
          key="{letter}{number}{board[row][col]}"
        >
          <Piece name={board[row][col]} />
        </div>
      {/each}
    {/each}
  </div>
  

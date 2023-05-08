<script>
    import MoveViewer from "./MoveViewer.svelte";
    import Piece from './Piece.svelte'
    import { Canvas } from 'svelte-canvas'
    import {Chess} from "chess.js";
    import { writable } from "svelte/store";
    import { onMount, onDestroy } from 'svelte';
    import { flip } from "svelte/animate";



    export let startingPositionFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    export let pgn = "";
    export let debug = false;

    let fen = "";
    let key = 0;
    let currentIndex = 0;
    let board = writable(fenToBoard(startingPositionFEN));
    let history = [];
    let boardValue;
    board.subscribe(value => {
        boardValue = value;
    });
    
   
    let chess = new Chess();

    let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let numbers = [8, 7, 6, 5, 4, 3, 2, 1];

    
    
    function validateFEN(fen) {
        const fenParts = fen.split(" ");
        if (fenParts.length !== 6) {
          return false;
      }

      const [position, activeColor, castling, enPassant, halfMove, fullMove] = fenParts;

      // Check position
      const rows = position.split("/");
      if (rows.length !== 8) {
        return false;
      }

      for (const row of rows) {
        let rowCount = 0;
        for (const char of row) {
          if (isNaN(parseInt(char))) {
            if (!"prnbqkPRNBQK".includes(char)) {
              return false;
            }
            rowCount += 1;
          } else {
            rowCount += parseInt(char);
          }
        }
        if (rowCount !== 8) {
          return false;
        }
      }

      // Check active color
      if (!["w", "b"].includes(activeColor)) {
        return false;
      }

      // Check castling availability
      if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(castling)) {
        return false;
      }

      // Check en passant target square
      if (!/^(?:(?:[a-h][36])|-)$/.test(enPassant)) {
        return false;
      }

      // Check halfmove clock and fullmove number
      if (isNaN(halfMove) || isNaN(fullMove)) {
        return false;
      }

      return true;
    }

  /**
   * Loads a PGN string and updates the board with the resulting position.
   */
    function loadFEN() {
      if (validateFEN(fen)) {
        chess.load(fen);
        board.set(fenToBoard(fen));
        console.log(board);
        console.log(boardValue);

        key += 1;
      } else {
        console.error("Invalid FEN:", fen);
      }
    }


  /**
   * Parses a PGN string into an array of moves.
   * @param {string} pgn - The PGN string.
   * @returns {Array<string>} An array of moves.
   */
  function loadPGN() {
    chess.loadPgn(pgn); // Load the PGN using chess.js
    history = chess.history({ verbose: true }); // Get the move history
    currentIndex = history.length; // Set the current index to the end of the history
    console.log(history)
    updateBoard(history); // Update the board using the move history
  
  }

  /**
   * Converts a FEN string to a 2D array representing the board.
   * @param {string} fen - The FEN string.
   * @returns {Array<Array<string>>} A 2D array representing the board.
   */
  function fenToBoard(fen) {
    const [position] = fen.split(" ");
    const rows = position.split("/");
    const board = rows.map((row) => {
        const newRow = [];
        for (const char of row) {
        if (isNaN(parseInt(char))) {
            newRow.push(char);
        } else {
            newRow.push(...Array(parseInt(char)).fill('_'));
        }
        }
        return newRow;
    });
    return board;
  }

  function handleMove(moveIndex, history) {
    // Reset the chess object to the initial position
    chess.reset();

    // Apply each move in the history array up to moveIndex (exclusive)
    for (let i = 0; i < moveIndex; i++) {
      const move = history[i];
      const result = chess.move(move);
      if (!result) {
        console.error("Invalid move:", move);
        break;
      }
    }
    currentIndex = moveIndex;

    // Update the board's position based on the chess object's FEN
    board.set(fenToBoard(chess.fen()));
  }

  function handleUndo() {
    currentIndex -= 1;
    if (currentIndex < 0) {
      currentIndex = 0;
    }
    handleMove(currentIndex, history);
  }

  function handleRedo() {
    currentIndex += 1;
    if (currentIndex > history.length) {
      currentIndex = history.length;
    }
    handleMove(currentIndex, history);
  }

  function handleGlobalKeyDown(event) {
    if (event.key === 'ArrowLeft') {
      handleUndo();
    }
    if (event.key === 'ArrowRight') {
      handleRedo();
    }
  }



  onMount(() => {
    window.addEventListener('keydown', handleGlobalKeyDown);
    loadPGN(pgn);
  });
  onDestroy(() => {
    window.removeEventListener('keydown', handleGlobalKeyDown);
  });

  /**
   * Updates the board position based on an array of moves.
   * @param {Array<string>} moves - An array of moves to apply.
   */

   function updateBoard(moves) {
    // Reset the chess object to the initial position
    chess.reset();

    if (!Array.isArray(moves)) {
      console.error("Invalid moves array:", moves);
      return;
    }

    // Apply each move in the moves array
    for (const move of moves) {
      const result = chess.move(move);
      if (!result) {
        console.error("Invalid move:", move);
        break;
      }
    }

    // Update the board's position based on the chess object's FEN
    const newFen = chess.fen();
    board.set(fenToBoard(newFen));
  }

  
  $: {
    boardValue = $board;
  }
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
  .chess-container {
	  display: flex;
	  justify-content: center;
	  align-items: flex-start;
	}
  .cell {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-width: 48px;
    min-height: 48px;
    max-width: 48px;
    max-height: 48px;
    border: 1px solid black;
  }
  .board-wrapper {
    margin-right: 16px; /* Adjust this value to set the spacing between the board and the move viewer */
  }
  .black {
    background-color: #b58863;
  }

  .white {
    background-color: #f0d9b5;
  }
</style>
  
{#if debug}
  <input bind:value={fen} placeholder="Enter FEN" />
  <button on:click={loadFEN}>Load FEN</button>
    

  <input bind:value={pgn} placeholder="Enter PGN" />
  <button on:click={loadPGN}>Load PGN</button>
{/if}

<div class="chess-container">
<div class="board-wrapper">
  <div class="board">
    {#each numbers as number, row}
      {#each letters as letter, col}
        <div
          class="cell {col % 2 === row % 2 ? 'white' : 'black'}"
          data-coordinate="{letter}{number}"
          key="{letter}{number}{boardValue[row][col]}"
          transition:flip={{ duration: 1000 }} 
        >
      <Piece name={boardValue[row][col]}/>
        </div>

      {/each}
    {/each}
  </div>
</div>
<MoveViewer {history} {handleMove} {handleUndo} {handleRedo} {currentIndex}/>

</div>

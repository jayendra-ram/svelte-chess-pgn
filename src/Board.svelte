<script>

    const startingPositionFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const arbPositionFEN = "r2q1rk1/pp2ppbp/1np2np1/2Q3B1/3P4/2P2N2/PP3PPP/R3KB1R w KQ - 1 10"

    let fen = "";
    let key = 0;

    let board = writable(fenToBoard(arbPositionFEN));
    board = writable(fenToBoard(startingPositionFEN));
    let boardValue;
    board.subscribe(value => {
        boardValue = value;
    });
    
   
    
    import Piece from './Piece.svelte'
    import { Canvas } from 'svelte-canvas'
    import {Chess} from "chess.js";
    import { writable } from "svelte/store";

    let chess = new Chess();

    let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let numbers = [8, 7, 6, 5, 4, 3, 2, 1];

    let pgn = "";
    


 /**
   * Validates a FEN string.
   * @param {string} fen - The FEN string to validate.
   * @returns {boolean} True if the FEN string is valid, false otherwise.
   */
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
    const history = chess.history({ verbose: true }); // Get the move history
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


  /**
   * Updates the board position based on an array of moves.
   * @param {Array<string>} moves - An array of moves to apply.
   */

   function updateBoard(moves) {
    // Reset the chess object to the initial position
    chess.reset();
    console.log(board);
    console.log(boardValue);
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
    board.set(fenToBoard(newFen)); // Update the board store
    key += 1;
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
  
<input bind:value={fen} placeholder="Enter FEN" />
<button on:click={loadFEN}>Load FEN</button>
  

<input bind:value={pgn} placeholder="Enter PGN" />
<button on:click={loadPGN}>Load PGN</button>

<div class="board">
  {#each numbers as number, row}
    {#each letters as letter, col}
      <div
        class="cell {col % 2 === row % 2 ? 'white' : 'black'}"
        data-coordinate="{letter}{number}"
        key="{letter}{number}{boardValue[row][col]}"
      >
      <Piece name={boardValue[row][col]}/> <!-- Use $board here -->
      </div>
    {/each}
  {/each}
</div>

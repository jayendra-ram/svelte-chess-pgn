<script>
    const startingPositionFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    let fen = "";

    let board = fenToBoard(startingPositionFEN);    
    import Piece from './Piece.svelte'
    import { Canvas } from 'svelte-canvas'
    import {Chess} from "chess.js";

    let chess = new Chess();

    let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let numbers = [8, 7, 6, 5, 4, 3, 2, 1];

    let pgn = "";
  let currentPosition = 0;



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

function loadFEN() {

  if (validateFEN(fen)) {
    chess.load(fen);
    board = fenToBoard(fen);
  } else {
    console.error("Invalid FEN:", fen);
  }
  console.log(board);

}


  function loadPGN() {
    chess.loadPgn(pgn); // Load the PGN using chess.js
    const history = chess.history({ verbose: true }); // Get the move history
    updateBoard(history); // Update the board using the move history
  }

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

  function getCoordinate(row, col) {
    return board[row][col];
  }

  function updateBoard(moves) {
  // Reset the chess object to the initial position
  chess.reset();
  console.log(board);

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
  board = [...fenToBoard(newFen)];
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
          key="{letter}{number}{board[row][col]}"
        >
          <Piece name={board[row][col]} />
        </div>
      {/each}
    {/each}
  </div>
  

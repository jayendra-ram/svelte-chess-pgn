import { Chessground as _Chessground } from "chessground/chessground";

function Chessground(node, { config, initializer }) {
  let api;
  function update(params) {
    api = _Chessground(node, params.config);
    if (params.initializer) {
      params.initializer(api);
    }
  }
  update({ config, initializer });

  return {
    update,
    destroy() {
      api.destroy();
    },
  };
}

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

  const [position, activeColor, castling, enPassant, halfMove, fullMove] =
    fenParts;

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
    board = fenToBoard(fen);
  } else {
    console.error("Invalid FEN:", fen);
  }
  console.log(board);
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
        newRow.push(...Array(parseInt(char)).fill("_"));
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

export { Chessground, cgStylesHelper };

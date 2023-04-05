const squareSize = 20;


function FENtoBoard(FEN) {
  let board = FEN.split(" ")[0].split("/");
  board.forEach(function (item, i) {
    board[i] = item.replace(/[1]/, "_");
    board[i] = board[i].replace(/[2]/, "__");
    board[i] = board[i].replace(/[3]/, "___");
    board[i] = board[i].replace(/[4]/, "____");
    board[i] = board[i].replace(/[5]/, "_____");
    board[i] = board[i].replace(/[6]/, "______");
    board[i] = board[i].replace(/[7]/, "_______");
    board[i] = board[i].replace(/[8]/, "________");
  });
  board = board.join("").split("");
  board.forEach(function (item, i) {
    board[i] = [item, Math.floor(i / 8), i % 8];
  });
  return board;
}

function pgnToFen(pgnMoves, fen) {
  let board = fen.split(" ")[0];
  let activeColor = fen.split(" ")[1];
  let castleAvailability = fen.split(" ")[2];
  let enPassantTarget = fen.split(" ")[3];
  let halfMoveClock = fen.split(" ")[4];
  let fullMoveNumber = fen.split(" ")[5];

  const pieces = {
    p: "wp",
    n: "wn",
    b: "wb",
    r: "wr",
    q: "wq",
    k: "wk",
    P: "bp",
    N: "bn",
    B: "bb",
    R: "br",
    Q: "bq",
    K: "bk",
  };

  for (const move of pgnMoves.split(" ")) {
    if (!isNaN(parseInt(move[0]))) {
      // This is a move number, skip it
      continue;
    } else if (move === "O-O") {
      // King-side castle
      if (activeColor === "w") {
        board = board.replace("e1", "-k-").replace("h1", "--r-");
      } else {
        board = board.replace("e8", "-k-").replace("h8", "--r-");
      }
      castleAvailability.replace(activeColor, "");
      castleAvailability.replace("-", "");
      if (castleAvailability === "") {
        castleAvailability = "-";
      }
      if (activeColor === "w") {
        activeColor = "b";
      } else {
        activeColor = "w";
        fullMoveNumber++;
      }
    } else if (move === "O-O-O") {
      // Queen-side castle
      if (activeColor === "w") {
        board = board.replace("e1", "-k-").replace("a1", "---r");
      } else {
        board = board.replace("e8", "-k-").replace("a8", "---r");
      }
      castleAvailability.replace(activeColor, "");
      castleAvailability.replace("-", "");
      if (castleAvailability === "") {
        castleAvailability = "-";
      }
      if (activeColor === "w") {
        activeColor = "b";
        fullMoveNumber++;
      } else {
        activeColor = "w";
      }
    } else {
      // Normal move
      const piece = move[0];
      const from = move.substr(1, 2);
      const to = move.substr(3, 2);
      const captured = move.includes("x") ? "x" : "";
      board = board.replace(from, captured + "-").replace(to, pieces[piece]);
      if (piece.toLowerCase() === "p" && Math.abs(to[1] - from[1]) === 2) {
        enPassantTarget = `${from[0]}${
          (parseInt(from[1]) + parseInt(to[1])) / 2
        }`;
      } else {
        enPassantTarget = "-";
      }
      castleAvailability.replace(activeColor, "");
      if (piece.toLowerCase() === "k") {
        castleAvailability.replace("-", "");
      }
      if (castleAvailability === "") {
        castleAvailability = "-";
      }
      if (activeColor === "w") {
        activeColor = "b";
        fullMoveNumber++;
      } else {
        activeColor = "w";
      }
    }
  }
  return `${board} ${activeColor} ${castleAvailability} ${enPassantTarget} ${halfMoveClock} ${fullMoveNumber}`;
}

const EXAMPLE_PGN = "1. e4";
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

//console.log("yaa")

//FEN -> pieces,

//(FEN,PNG command) -> FEN

const start = "rnbqkbnr".split("");

let pieces = [0, 1].flatMap((index) => {
  return start
    .map((piece, file) => {
      return [`${piece}`, file, index ? 7 : 0];
    })
    .concat(start.map((_, file) => [`P`, file, index ? 6 : 1]));
});

module.exports = {
  FENtoBoard,
  pgnToFen,
  EXAMPLE_PGN,
  START_FEN,
  pieces,
  squareSize,
};

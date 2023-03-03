export const squareSize = 20

export function FENtoBoard(FEN) {
  let board = FEN.split(' ')[0].split('/')
  board.forEach(function(item, i) { board[i] = item.replace(/[1]/,'_'); 
                                    board[i] = board[i].replace(/[2]/,'__');
                                    board[i] = board[i].replace(/[3]/,'___');
                                    board[i] = board[i].replace(/[4]/,'____');
                                    board[i] = board[i].replace(/[5]/,'_____');
                                    board[i] = board[i].replace(/[6]/,'______');
                                    board[i] = board[i].replace(/[7]/,'_______');
                                    board[i] = board[i].replace(/[8]/,'________');
                                  });
  board = board.join('').split('')
  board.forEach(function(item,i) { board[i] = [item, Math.floor(i/8),  i%8]})
  return board}


 
//FEN -> pieces, 

//(FEN,PNG command) -> FEN

export const start = 'rnbqkbnr'.split('')




export let pieces = [0, 1].flatMap((index) => {
    return start.map((piece, file) => {
      return [`${piece}`, file, index ? 7 : 0]
    }).concat(start.map((_, file) => [`P`, file, index ? 6 : 1]))
  })
export const squareSize = 20

const default_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

let ting = default_FEN.split(' ')[0].split('/')

ting.forEach(function(item, i) { if (item == '8') ting[i] = "________"; });
console.log(ting)

//FEN -> pieces, 


export const start = 'rnbqkbnr'.split('')
export let pieces = [0, 1].flatMap((index) => {
    return start.map((piece, file) => {
      return [`${piece}`, file, index ? 7 : 0]
    }).concat(start.map((_, file) => [`P`, file, index ? 6 : 1]))
  })
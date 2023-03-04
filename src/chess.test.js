const chess = require('./chess')


// TESTING FEN FUNCTION


test('default position check', () => {
    const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const output = chess.FENtoBoard(DEFAULT_FEN).map((x) => x[0])
    
    const DEFAULT_BOARD = ['rnbqkbnr', 'pppppppp', '________', '________', '________', '________', 'PPPPPPPP', 'RNBQKBNR']
    const DEFAULT_BOARD_FLAT = DEFAULT_BOARD.join('').split('')
        
    expect(output).toStrictEqual(DEFAULT_BOARD_FLAT)
})

test('empty board check', () => {
    const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const output = chess.FENtoBoard(DEFAULT_FEN).map((x) => x[0])
    
    const DEFAULT_BOARD = ['rnbqkbnr', 'pppppppp', '________', '________', '________', '________', 'PPPPPPPP', 'RNBQKBNR']
    const DEFAULT_BOARD_FLAT = DEFAULT_BOARD.join('').split('')
        
    expect(output).toStrictEqual(DEFAULT_BOARD_FLAT)
})

test('puzzle position check 1', () => {
    const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const output = chess.FENtoBoard(DEFAULT_FEN).map((x) => x[0])
    
    const DEFAULT_BOARD = ['rnbqkbnr', 'pppppppp', '________', '________', '________', '________', 'PPPPPPPP', 'RNBQKBNR']
    const DEFAULT_BOARD_FLAT = DEFAULT_BOARD.join('').split('')
        
    expect(output).toStrictEqual(DEFAULT_BOARD_FLAT)
})

test('puzzle position check 2', () => {
    const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const output = chess.FENtoBoard(DEFAULT_FEN).map((x) => x[0])
    
    const DEFAULT_BOARD = ['rnbqkbnr', 'pppppppp', '________', '________', '________', '________', 'PPPPPPPP', 'RNBQKBNR']
    const DEFAULT_BOARD_FLAT = DEFAULT_BOARD.join('').split('')
        
    expect(output).toStrictEqual(DEFAULT_BOARD_FLAT)
})

test('puzzle position check 3', () => {
    const DEFAULT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const output = chess.FENtoBoard(DEFAULT_FEN).map((x) => x[0])
    
    const DEFAULT_BOARD = ['rnbqkbnr', 'pppppppp', '________', '________', '________', '________', 'PPPPPPPP', 'RNBQKBNR']
    const DEFAULT_BOARD_FLAT = DEFAULT_BOARD.join('').split('')
        
    expect(output).toStrictEqual(DEFAULT_BOARD_FLAT)
})
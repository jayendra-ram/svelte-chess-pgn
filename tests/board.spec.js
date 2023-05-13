import { render, fireEvent } from '@testing-library/svelte';
import Board from '../dist/Board.svelte'; // Update with your actual path

describe('ChessBoard', () => {
  it('renders the initial board correctly', () => {
    const { getAllByAltText } = render(Board, { startingPositionFEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' });

    // Check that all pieces are rendered
    const pieces = {
      'r': 2, 'n': 2, 'b': 2, 'q': 1, 'k': 1, 'p': 8, // Black pieces
      'R': 2, 'N': 2, 'B': 2, 'Q': 1, 'K': 1, 'P': 8  // White pieces
    };

    Object.entries(pieces).forEach(([piece, count]) => {
      const pieceImages = getAllByAltText(piece);
      expect(pieceImages.length).toBe(count);
    });
  });
  it('loads a FEN string correctly', async () => {
    const { getByPlaceholderText, getByText } = render(Board, { debug: true });

    // Load a FEN string
    const fenInput = getByPlaceholderText('Enter FEN');
    
    // @ts-ignore
    await fireEvent.input(fenInput, { target: { value: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' } });
    const loadFenButton = getByText('Load FEN');
    // @ts-ignore
    await fireEvent.click(loadFenButton);

    // TODO: Check that the board is updated correctly
    // This will depend on how your board is rendered and may require querying by multiple elements or even snapshots
  });


});


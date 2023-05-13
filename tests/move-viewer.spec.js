import { render } from '@testing-library/svelte';
import MoveViewer from '../dist/MoveViewer.svelte'; // Update with your actual path

describe('MoveViewer', () => {
  it('renders and displays the correct number of buttons', () => {
    const history = [
      { san: 'e4' },
      { san: 'e5' },
      { san: 'Nf3' },
      // add more moves as needed
    ];
    const { getAllByRole } = render(MoveViewer, { history });

    // check if component renders the correct number of move buttons
    // we add 2 because there are 2 more buttons for 'prev' and 'next'
    expect(getAllByRole('button')).toHaveLength(history.length + 2);
  });
});

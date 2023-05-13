import { render } from '@testing-library/svelte';
import Board from '../dist/MoveViewer.svelte';

describe('Board component', () => {
  it('renders without errors', () => {
    const { container } = render(Board);

    // Add your assertions here
    // For example, you can check if the component's container is rendered correctly
    expect(container).toBeInTheDocument();
  });
});
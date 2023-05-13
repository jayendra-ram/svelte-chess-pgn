import { render } from "@testing-library/svelte";
import Piece from "../dist/Piece.svelte";

describe("Piece component", () => {
  it("renders the correct image for a given piece name", async () => {
    const testCases = [
      { name: 'k', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg' },
      { name: 'q', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg' },
      { name: 'r', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg' },
      // Add more test cases for other piece names...
    ];

    for (const testCase of testCases) {
      const { getByAltText } = render(Piece, { name: testCase.name });
      const img = getByAltText(testCase.name);

      expect(img).toBeInTheDocument();
      expect(img.src).toBe(testCase.imageUrl);
    }
  });

  it("renders a placeholder image when name is '_'", async () => {
    const { getByAltText } = render(Piece, { name: '_' });
    const img = getByAltText('_');

    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://upload.wikimedia.org/wikipedia/commons/1/1d/No_image.svg');
  });
});

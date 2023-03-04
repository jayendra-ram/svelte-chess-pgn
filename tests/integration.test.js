import Index from "../src/App.svelte";
import { render } from "@testing-library/svelte";


describe("Test if Jest is working", () => {
    test("Welcome", () => {
      const { getByText } = render(Index);
      expect(getByText("")).toBeInTheDocument();
    });
  });


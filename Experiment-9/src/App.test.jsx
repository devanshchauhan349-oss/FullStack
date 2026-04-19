import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders deployment heading", () => {
    window.__APP_CONFIG__ = {
      APP_TITLE: "React Docker Deployment"
    };

    render(<App />);

    expect(
      screen.getByRole("heading", { name: /react docker deployment/i })
    ).toBeInTheDocument();
  });
});

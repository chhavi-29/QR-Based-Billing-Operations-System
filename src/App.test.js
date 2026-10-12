import { render, screen } from '@testing-library/react';
import App from './App';

test('renders billing system login heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/welcome to the billing system/i);
  expect(headingElement).toBeInTheDocument();
});

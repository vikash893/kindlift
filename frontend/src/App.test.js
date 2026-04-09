/**
 * @fileoverview App component smoke test
 *
 * Verifies that the App component renders without crashing
 * and contains the expected root elements.
 */

import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Three.js components that don't work in jsdom
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="canvas">{children}</div>,
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  useGLTF: () => ({ scene: {} }),
  Environment: () => null,
}));

// Mock socket.io-client
jest.mock('./lib/socket', () => ({
  socket: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  },
}));

// Mock the API module
jest.mock('./lib/api', () => ({
  get: jest.fn().mockRejectedValue(new Error('Not authenticated')),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    // If render doesn't throw, the test passes
    expect(document.querySelector('.min-h-screen')).toBeInTheDocument();
  });
});

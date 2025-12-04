/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

// Mock all SolidStart/router dependencies before any imports
vi.mock('@solidjs/router', () => ({
  action: vi.fn((fn) => fn),
  query: vi.fn((fn) => fn),
  json: vi.fn(),
  redirect: vi.fn(),
  A: vi.fn(({ href, children }: any) => children),
}));

vi.mock('@solidjs/start', () => ({
  clientOnly: vi.fn((component) => component),
}));

// Mock the server actions
vi.mock('~/client-api/query-action', () => ({
  addUserNoRedirect: vi.fn(),
  getCars: vi.fn(),
  getUsers: vi.fn(),
  addCar: vi.fn(),
  addUser: vi.fn(),
  updateCar: vi.fn(),
  updateUser: vi.fn(),
  deleteCar: vi.fn(),
  deleteUser: vi.fn(),
}));

import { render, screen, cleanup } from '@solidjs/testing-library';
import WithJs from './with-js';

afterEach(() => cleanup());

describe('<WithJs />', () => {
  it('renders without crashing', () => {
    render(() => <WithJs />);
    // Check for a known string in the component
    expect(screen.getByText(/with-js/i)).toBeDefined();
  });
});

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Setup global Jest types
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

// Mock for matchMedia which is not implemented in JSDOM
global.matchMedia = global.matchMedia || function () {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

// Mock for window.scrollTo
global.scrollTo = jest.fn();

// Mock for IntersectionObserver which is not implemented in JSDOM
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback, options) {}
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

// Mock for window.ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {}
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

// Mock for window.URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock for window methods not available in JSDOM
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({
    data: new Array(4),
  })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => []),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
}));

// -----------------------------------------------------------------------------
// Global test-environment hardening
// -----------------------------------------------------------------------------
// In plain Jest runs (or when individual tests deliberately delete `window`)
// React-DOM still expects a handful of browser APIs.  We create a *very* small
// stub so that any component can mount without throwing reference errors.

if (typeof global.window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – we are intentionally creating a global stub
  global.window = {} as any;
}

// Basic DOM-like objects expected by React / libraries
// (We only create them if missing so we don't overwrite jsdom when it is
// already provided by react-scripts.)
const win = global.window as any;

if (!win.document) {
  win.document = {
    createElement: () => ({ style: {} }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
}

if (!win.navigator) {
  win.navigator = { userAgent: 'node.js' };
}

// Timers
if (!win.requestAnimationFrame) {
  win.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 0);
  win.cancelAnimationFrame = (id: any) => clearTimeout(id);
} 
// Placeholder for react-refresh/runtime.js
// This file prevents import errors when building

// Export a mock implementation that does nothing
export function injectIntoGlobalHook() {}
export const RefreshRuntime = {
  performReactRefresh: () => {},
  register: () => {},
  createSignatureFunctionForTransform: () => () => {},
};

export default {
  injectIntoGlobalHook,
  RefreshRuntime,
};

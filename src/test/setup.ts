import '@testing-library/jest-dom';

// Ensure localStorage & sessionStorage polyfill in test environment
const createStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };
};

if (typeof window !== 'undefined') {
  const localMock = createStorageMock();
  const sessionMock = createStorageMock();
  Object.defineProperty(window, 'localStorage', { value: localMock, writable: true });
  Object.defineProperty(window, 'sessionStorage', { value: sessionMock, writable: true });
  Object.defineProperty(globalThis, 'localStorage', { value: localMock, writable: true });
  Object.defineProperty(globalThis, 'sessionStorage', { value: sessionMock, writable: true });
}

// Ensure crypto polyfill in test environment
if (typeof window !== 'undefined' && (!window.crypto || !window.crypto.getRandomValues)) {
  const cryptoMock = {
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
  };
  Object.defineProperty(window, 'crypto', { value: cryptoMock, writable: true });
}

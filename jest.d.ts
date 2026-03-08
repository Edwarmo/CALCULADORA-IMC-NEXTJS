import '@testing-library/jest-dom';

// Extend Jest expect with jest-dom matchers
import * as matchers from '@testing-library/jest-dom/matchers';

declare global {
  namespace jest {
    interface Matchers<R> extends matchers.Matchers<R> {}
  }
}

expect.extend(matchers);

export {};

import type { NextConfig } from "next";

// Suppress the url.parse deprecation warning from dependencies
if (typeof process !== 'undefined') {
  const originalEmit = process.emit;
  // @ts-expect-error - process.emit has complex typing
  process.emit = function (name, data, ...args) {
    if (
      name === 'warning' &&
      typeof data === 'object' &&
      data !== null &&
      (data as any).name === 'DeprecationWarning' &&
      (data as any).code === 'DEP0169'
    ) {
      return false;
    }
    // @ts-expect-error - Complex typing for process.emit arguments
    return originalEmit.apply(process, [name, data, ...args]);
  };
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

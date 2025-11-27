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
      data.name === 'DeprecationWarning' &&
      data.code === 'DEP0169'
    ) {
      return false;
    }
    return originalEmit.apply(process, [name, data, ...args]);
  };
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

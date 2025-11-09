export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

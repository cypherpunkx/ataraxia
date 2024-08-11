export const retryDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

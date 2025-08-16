function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function simulateFailure(failureRate: number = 0.1): boolean {
  return Math.random() < failureRate;
}

export { delay, simulateFailure };

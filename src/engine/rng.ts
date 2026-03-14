export function randomInt(min: number, max: number): number {
  const range = max - min + 1;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % range);
}

export function pickWeighted<T>(items: { value: T; weight: number }[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = randomInt(0, totalWeight - 1);
  for (const item of items) {
    random -= item.weight;
    if (random < 0) return item.value;
  }
  return items[items.length - 1].value;
}

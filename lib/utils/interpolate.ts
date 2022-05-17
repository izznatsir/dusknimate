import { clamp } from './clamp';

export function interpolate(input: [number, number], output: [number, number]) {
  const inputDistance = input[1] - input[0];
  const outputDistance = output[1] - output[0];
  return (value: number) => {
    const clamped = clamp(value, input);
    const normalized = clamped - input[0];

    const ratio = normalized / inputDistance;

    const result = output[0] + ratio * outputDistance;

    return result;
  };
}

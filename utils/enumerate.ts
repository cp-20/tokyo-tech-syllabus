export const enumerate = <T>(arr: T[]): [number, T][] =>
  arr.map((item, index) => [index, item]);

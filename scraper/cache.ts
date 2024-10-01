import type { BunFile } from 'bun';

export const cache = async <T>(
  func: () => Promise<T> | T,
  file: BunFile,
  forceUpdate = false,
): Promise<{ result: T; hit: boolean }> => {
  if (!forceUpdate && (await file.exists())) {
    return { result: JSON.parse(await file.text()), hit: true };
  }

  const result = await func();

  await Bun.write(file, JSON.stringify(result));

  return { result, hit: false };
};

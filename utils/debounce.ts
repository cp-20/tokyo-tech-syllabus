export const debounce = <T, F>(
  fn: (arg: T, arg2: F) => unknown,
  wait: number,
) => {
  let timer: Timer | null = null;
  return function (arg: T, arg2: F) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(arg, arg2), wait);
  };
};

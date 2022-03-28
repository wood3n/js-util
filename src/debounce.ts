/**
 * 防抖
 * @public
 */
export default function debounce<R>(
  fn: (...args: unknown[]) => R,
  timeout: number
) {
  let timerId: number | null;
  return function (...args: unknown[]) {
    let result: R | undefined;
    if (timerId) {
      window.clearTimeout(timerId);
    }

    timerId = window.setTimeout(() => {
      result = fn.call(this, ...args);
      timerId = null;
    }, timeout);

    return result;
  };
}

/**
 * 节流处理
 * @public
 */
export default function throttle<R>(
  fn: (...args: unknown[]) => R,
  interval: number
) {
  let timerId: number | null,
    lastInvokeTime = 0;
  return function (...args: unknown[]) {
    if (timerId) {
      window.clearTimeout(timerId);
    }

    const expiration = Date.now() - lastInvokeTime;
    let result;
    if (expiration >= interval) {
      lastInvokeTime = Date.now();
      result = fn.call(this, ...args);
    } else {
      timerId = window.setTimeout(() => {
        lastInvokeTime = Date.now();
        result = fn.call(this, ...args);
        timerId = null;
      });
    }

    return result;
  };
}

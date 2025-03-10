function throttle(func: Function, limit: number) {
  let lastCall = 0;
  let timer: number | null = null;
  return function (this: unknown, ...args: unknown[]) {
    if (!lastCall) {
      func.apply(this, args);
      lastCall = Date.now();
    } else {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(
        () => {
          if (Date.now() - lastCall >= limit) {
            func.apply(this, args);
            lastCall = Date.now();
          }
        },
        limit - (Date.now() - lastCall),
      );
    }
  };
}

export default throttle;

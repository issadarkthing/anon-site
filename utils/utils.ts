
export function delayAsync<T>(cb: () => Promise<T>, delay: number) {
  return async () => {
    const result = await cb();
    return new Promise<T>(resolve => {
      setTimeout(() => {
        resolve(result);
      }, delay);
    })
  }
}

export function getLastItem(path: string) {
  return path.substring(path.lastIndexOf("/") + 1);
}


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


function stringToColor(str: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export const avatarSize = {
  height: "80px",
  width: "80px",
}

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      ...avatarSize,
    },
    children: `${name.split(' ')[0][0]}`,
  };
}

export function getAbsoluteURL(path: string) {
  const baseURL = process.env.URL ? 
    `https://${process.env.URL}` : 
    "http://localhost:3000"
  return baseURL + path
}

import path from 'path';
import pathToRegexp from 'path-to-regexp';

export function relativeFilePath(from: string, to: string) {
  return path.relative(from, to.replace(/\.[^/.]+$/, ''));
}

export function pathMatch(route: string, pathname: string | undefined) {
  const keys: Array<any> = [];
  const regex = pathToRegexp(route, keys, {});

  const match = regex.exec(pathname as string);

  if (!match) {
    return false;
  }

  return keys.reduce((acc, key, index) => {
    const param = match[index + 1];

    if (!param) {
      return acc;
    }

    const value = decodeURIComponent(param);

    return {
      ...acc,
      [key.name]: key.repeat ? value.split(key.delimiter) : value,
    };
  }, {});
}

const generateShortId = (): string =>
  Math.random().toString(36).substring(2, 8);

export const generateId = (prefix: string): string =>
  `${prefix}_${generateShortId()}`;

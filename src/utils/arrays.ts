export const toList = (value?: string) => {
  if (!value) return [] as string[];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

export const listToString = (value?: string[]) => {
  if (!value || value.length === 0) return '';
  return value.join(', ');
};

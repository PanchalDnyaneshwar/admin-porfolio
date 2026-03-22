export const formatNumber = (value?: number) => {
  if (typeof value !== 'number') return '0';
  return new Intl.NumberFormat('en-US').format(value);
};

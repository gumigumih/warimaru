export const formatCurrency = (value: number) => {
  return `${Math.round(value).toLocaleString()}円`;
};


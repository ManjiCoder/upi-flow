export const formattedAmount = (amount: any, currency?: boolean) => {
  if (currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getTotal = (x: any, y: any) => {
  return x + y;
};

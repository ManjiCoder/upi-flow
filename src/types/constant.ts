export enum appInfo {
  title = 'UPI Flow',
  desc = 'UPIFlow simplifies tracking your UPI transactions, giving you clear insights into your spending.',
}

export const banks = {
  icici: { id: 1, name: 'icicibank' },
  sbi: { id: 2, name: 'State Bank of India' },
  paytm: { id: 3, name: 'www.paytmbank.com' },
};

export enum PaymentModes {
  CASH = 'Cash',
  CREDIT_CARD = 'Credit Card',
  DEBIT_CARD = 'Debit Card',
  NET_BANKING = 'Net Banking',
  MOBILE_BANKING = 'Moblie Banking',
  UPI = 'UPI',
  WALLET = 'Wallet',
  CHEQUE = 'Cheque',
  OTHER = 'Other',
  Int = 'Interest',
  Interest = 'Interest',
  ATMCARD = 'AMT Card',
  IMPS = 'IMPS',
  BANK = 'Bank',
}

export interface Transaction {
  id: number;
  date: string;
  balance: number;
  mode?: string | null;
  credit?: number | null;
  debit?: number | null;
  refNo?: string | null;
  details?: string | null;
  amt?: number;
  bankId?: number;
  to?: string;
  receiver?: string;
}

export const FilterOption = {
  Daily: { name: 'Daily', format: 'MMM dd, yyyy' },
  Weekly: { name: 'Weekly', format: 'MMM dd' },
  Monthly: { name: 'Monthly', format: 'MMMM, yyyy' },
  ThreeMonths: { name: '3 Months', format: 'MMM, yy' },
  SixMonths: { name: '6 Months', format: 'MMM, yy' },
  Yearly: { name: 'Yearly', format: 'yyyy' },
};

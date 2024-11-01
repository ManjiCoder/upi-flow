import { Transaction } from '@/types/constant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Transaction[] = [];

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setRows: (_, action: PayloadAction<Transaction[]>) => {
      const records = action.payload;
      return records;
    },
    resetPaymentSlice: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRows, resetPaymentSlice } = paymentsSlice.actions;

export default paymentsSlice;

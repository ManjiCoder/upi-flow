import { FilterOption, Transaction } from '@/types/constant';
import { getTotal } from '@/utils/helper';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';

interface dateSliceState {
  dateFilter: string;
  filterData:
    | {
        [timeStamp: string]: Transaction[];
      }
    | {};
  expense: number;
  income: number;
  balance: number;
  search: null | string;
}

const initialState: dateSliceState = {
  dateFilter: new Date().toISOString(),
  filterData: {},
  expense: 0,
  income: 0,
  balance: 0,
  search: null,
};

const dateSlice = createSlice({
  name: 'dateSlice',
  initialState,
  reducers: {
    incrementDateFilter: (state, action) => {
      const key = action.payload;
      let newDate;
      switch (key) {
        case FilterOption.Daily.name:
          newDate = addDays(new Date(state.dateFilter), 1).toISOString();
          break;
        case FilterOption.Weekly.name:
          newDate = addWeeks(new Date(state.dateFilter), 1).toISOString();
          newDate = startOfWeek(newDate, { weekStartsOn: 0 }).toISOString();
          break;
        case FilterOption.ThreeMonths.name:
          newDate = addMonths(new Date(state.dateFilter), 3).toISOString();
          break;
        case FilterOption.SixMonths.name:
          newDate = addMonths(new Date(state.dateFilter), 6).toISOString();
          break;
        case FilterOption.Yearly.name:
          newDate = addYears(new Date(state.dateFilter), 1).toISOString();
          break;

        default:
          newDate = addMonths(new Date(state.dateFilter), 1).toISOString();
          break;
      }
      state.dateFilter = newDate;
    },
    decrementDateFilter: (state, action) => {
      const key = action.payload;
      let newDate;
      switch (key) {
        case FilterOption.Daily.name:
          newDate = subDays(new Date(state.dateFilter), 1).toISOString();
          break;
        case FilterOption.Weekly.name:
          newDate = subWeeks(new Date(state.dateFilter), 1).toISOString();
          newDate = startOfWeek(newDate, { weekStartsOn: 0 }).toISOString();
          break;
        case FilterOption.ThreeMonths.name:
          newDate = subMonths(new Date(state.dateFilter), 3).toISOString();
          break;
        case FilterOption.SixMonths.name:
          newDate = subMonths(new Date(state.dateFilter), 6).toISOString();
          break;
        case FilterOption.Yearly.name:
          newDate = subYears(new Date(state.dateFilter), 1).toISOString();
          break;

        default:
          newDate = subMonths(new Date(state.dateFilter), 1).toISOString();
          break;
      }
      state.dateFilter = newDate;
    },
    setFilterData: (
      state,
      action: PayloadAction<{
        data: Transaction[];
        startDate: string;
        endDate: string;
      }>
    ) => {
      const { data } = action.payload;
      const startDate = parseISO(action.payload.startDate);
      const endDate = parseISO(action.payload.endDate);
      const filterData = data
        .filter((item) => {
          const date = parseISO(item.date);
          return (
            isSameDay(date, startDate) ||
            isSameDay(date, endDate) ||
            (isBefore(date, endDate) && isAfter(date, startDate))
          );
        })
        .sort((a, b) => b.id - a.id);
      // console.log(filterData);
      const newData: { [date: string]: Transaction[] } = {};
      filterData.map((item) => {
        const date = new Date(new Date(item.date).setHours(0, 0, 0, 0));
        const dateStr = date.toISOString();
        if (isSameDay(date, parseISO(item.date))) {
          if (newData[dateStr]) {
            newData[dateStr].push(item);
          } else {
            newData[dateStr] = [item];
          }
        }
      });
      // console.log(newData);

      const totalIncome = filterData
        .map(({ credit }) => credit)
        .filter(Boolean)
        .reduce(getTotal, 0) as number;
      const totalExpense = filterData
        .map(({ debit }) => debit)
        .filter(Boolean)
        .reduce(getTotal, 0) as number;
      const totalBalance = (totalIncome || 0) - (totalExpense || 0);

      state.filterData = newData;
      state.income = totalIncome;
      state.expense = totalExpense;
      state.balance = totalBalance;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const {
  incrementDateFilter,
  decrementDateFilter,
  setFilterData,
  setSearch,
} = dateSlice.actions;
export default dateSlice.reducer;

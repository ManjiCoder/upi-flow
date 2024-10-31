import {
  decrementDateFilter,
  incrementDateFilter,
  setFilterData,
} from '@/redux/features/Filter/dateSlice';
import { useAppSelector } from '@/redux/hooks';
import { formattedAmount } from '@/utils/helper';
import { ChevronLeft, ChevronRight, LucideListFilter } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setFilter } from '@/redux/features/Filter/filterSlice';
import { FilterOption } from '@/types/constant';
import {
  addMonths,
  endOfWeek,
  format,
  getDate,
  lastDayOfMonth,
  setDate,
  startOfWeek,
} from 'date-fns';

export default function FlowInfo() {
  const { data } = useAppSelector((state) => state.payments);
  const { filter } = useAppSelector((state) => state.filter);
  const { dateFilter, expense, income, balance } = useAppSelector(
    (state) => state.dateSlice
  );
  const dispatch = useDispatch();

  const isBalancePositive =
    Math.sign(balance) === 1 || Math.sign(balance) === 0;

  const showDate = useMemo(() => {
    let formattedDate;
    switch (filter.name) {
      case FilterOption.Daily.name:
        formattedDate = format(new Date(dateFilter), filter.format);
        break;

      case FilterOption.Weekly.name:
        const d1 = startOfWeek(new Date(dateFilter), { weekStartsOn: 0 });
        const d2 = endOfWeek(new Date(dateFilter), { weekStartsOn: 0 });
        formattedDate = `${format(d1, filter.format)} - ${format(
          d2,
          filter.format
        )}`;
        break;

      case FilterOption.ThreeMonths.name:
        formattedDate = `${format(
          new Date(dateFilter),
          filter.format
        )} - ${format(addMonths(new Date(dateFilter), 2), filter.format)}`;
        break;

      case FilterOption.SixMonths.name:
        formattedDate = `${format(
          new Date(dateFilter),
          filter.format
        )} - ${format(addMonths(new Date(dateFilter), 5), filter.format)}`;
        break;

      case FilterOption.Yearly.name:
        formattedDate = format(new Date(dateFilter), filter.format);
        break;

      default:
        formattedDate = format(new Date(dateFilter), filter.format);
        break;
    }
    return formattedDate;
  }, [filter, dateFilter]);

  const handleFilter = (key: string) => {
    dispatch(setFilter(key));
  };
  const calculateFromToDate = () => {
    let startDate;
    let endDate;
    switch (filter.name) {
      case FilterOption.Daily.name:
        startDate = new Date(
          new Date(dateFilter).setHours(0, 0, 0, 0)
        ).toISOString();
        endDate = startDate;
        break;

      case FilterOption.Weekly.name:
        startDate = startOfWeek(new Date(dateFilter), {
          weekStartsOn: 0,
        }).toISOString();

        endDate = endOfWeek(new Date(dateFilter), {
          weekStartsOn: 0,
        }).toISOString();
        break;

      case FilterOption.ThreeMonths.name:
        startDate = setDate(dateFilter, 1).toISOString();
        endDate = addMonths(
          setDate(startDate, getDate(lastDayOfMonth(startDate))),
          2
        ).toISOString();
        break;

      case FilterOption.SixMonths.name:
        startDate = setDate(dateFilter, 1).toISOString();
        endDate = addMonths(startDate, 6).toISOString();
        break;

      case FilterOption.Yearly.name:
        const year = new Date(dateFilter).getFullYear();
        startDate = new Date(year, 0, 1, 0, 0, 0, 0).toISOString();
        endDate = new Date(year, 11, 31, 23, 59, 59, 999).toISOString();
        break;

      default:
        startDate = setDate(dateFilter, 1).toISOString();
        endDate = setDate(
          startDate,
          getDate(lastDayOfMonth(startDate))
        ).toISOString();
        break;
    }
    return { startDate, endDate };
  };
  useEffect(() => {
    const { startDate, endDate } = calculateFromToDate();
    // console.log(startDate, endDate);
    if (startDate && endDate) {
      dispatch(setFilterData({ data, startDate, endDate }));
    }
  }, [data, dateFilter, filter]);

  return (
    <header className='flex px-8 py-3 flex-col sticky z-50 top-0 backdrop-blur-sm border-b-2 mb-4'>
      <h3 className='flex border-none justify-between items-center mb-2'>
        <ChevronLeft
          className='h-10 w-10 p-2 hover:bg-secondary rounded-md'
          role='button'
          size={26}
          onClick={() => {
            dispatch(decrementDateFilter(filter.name));
          }}
        />
        {showDate}
        <ChevronRight
          className='h-10 w-10 p-2 hover:bg-secondary rounded-md'
          role='button'
          size={26}
          onClick={() => {
            dispatch(incrementDateFilter(filter.name));
          }}
        />
      </h3>
      <h4 className='flex justify-between'>
        <div className='flex flex-col text-left'>
          <span>Expense </span>
          <span className='text-red-600 dark:text-red-400 '>
            {`${formattedAmount(expense, true)}`}
          </span>
        </div>
        <div className='flex flex-col text-center'>
          <span>Income</span>
          <span className='text-green-600 dark:text-green-400 '>
            {`${formattedAmount(income, true)}`}
          </span>
        </div>
        <div className='flex flex-col text-right'>
          <span>Balance </span>
          <span
            className={
              isBalancePositive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }
          >
            {`${formattedAmount(balance, true)}`}
          </span>
        </div>
      </h4>

      <DropdownMenu>
        <DropdownMenuTrigger className='absolute top-3 -right-2 outline-none'>
          <LucideListFilter
            role='button'
            className='h-10 w-10 p-2 hover:bg-secondary rounded-md'
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='absolute -right-5'>
          <DropdownMenuLabel>Display Option</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.entries(FilterOption).map(([key, value]) => {
            return (
              <DropdownMenuItem
                key={key}
                className={value.name === filter.name ? 'bg-secondary' : ''}
                onClick={() => handleFilter(key)}
              >
                {value.name}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

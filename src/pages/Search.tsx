import PageWrapper from '@/components/layout/PageWrapper';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/redux/hooks';
import { Transaction } from '@/types/constant';
import { formattedAmount } from '@/utils/helper';
import { format } from 'date-fns';
import {
  CalendarSearch,
  LucideBadgeIndianRupee,
  LucideCornerLeftUp,
  LucideCornerUpRight,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function Search() {
  const { data } = useAppSelector((state) => state.payments);
  const [text, setText] = useState('');
  const [searchResults, setSearchResults] = useState<Transaction[]>([]);

  const { income, expense, balance } = useMemo(() => {
    const totalIncome = searchResults
      .map(({ credit }) => credit)
      .filter(Boolean)
      .reduce((x, y) => {
        // @ts-ignore
        return x + y;
      }, 0);
    const totalExpense = searchResults
      .map(({ debit }) => debit)
      .filter(Boolean)
      .reduce((x, y) => {
        // @ts-ignore
        return x + y;
      }, 0);

    const totalBalance = (totalIncome || 0) - (totalExpense || 0);
    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalBalance,
    };
  }, [searchResults]);

  const isBalancePositive = Math.sign(balance) !== -1;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const showSearchResults = (searchText: string) => {
    return new Promise<Transaction[] | false>((res, rej) => {
      try {
        const newData = data.map((item) => {
          return { ...item, date: format(item.date, 'dd-MMM-yyyy') };
        });
        if (searchText.trim().length === 0) res([]);
        const result = newData
          .filter((item) => {
            return JSON.stringify(item)
              .toLowerCase()
              .includes(searchText.toLowerCase());
          })
          .sort((a, b) => b.id - a.id);
        res(result);
      } catch (error) {
        rej(false);
      }
    });
  };

  useEffect(() => {
    // Deboucing
    const timerId = setTimeout(async () => {
      const data = await showSearchResults(text.trim());
      // console.log(data);
      if (data) {
        setSearchResults(data);
      }
    }, 500);

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [text]);

  return (
    <PageWrapper className='gap-y-5'>
      <header className='flex px-8 py-3 gap-y-3 flex-col sticky top-0 backdrop-blur-sm border-b-2'>
        <Input
          type='search'
          placeholder='Search for records'
          autoFocus
          onChange={handleChange}
          value={text}
        />
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
      </header>

      {searchResults.length === 0 && (
        <div className='min-h-[60vh] flex flex-col gap-3 items-center justify-center'>
          <CalendarSearch size={70} />
          <h4>Search Records.</h4>
        </div>
      )}
      <div>
        <h3 className='text-center line-clamp-1'>
          {searchResults.length !== 0 &&
            searchResults.length + ' Results found.'}
        </h3>
        {searchResults.map((row) => {
          return (
            <section key={row.id} className='py-3 border-b-2'>
              <h5 className='text-lg font-semibold mb-2'>
                {format(row.date, 'MMM dd yyyy, EEEE')}
              </h5>
              <section className='grid grid-cols-[80%,20%] py-2 items-center justify-between border-t'>
                <div className='flex space-x-2 items-center'>
                  {/* Icon */}
                  <p className='row-span-2'>
                    <LucideBadgeIndianRupee />
                  </p>
                  <div className='flex flex-col gap-y-0.5 justify-start'>
                    {/* Receiver */}
                    <p className='flex items-center gap-x-1'>
                      <LucideCornerUpRight size={16} />
                      <span className='font-semibold'>
                        {row.receiver ? row.receiver : row.to}
                      </span>
                    </p>
                    <p className='text-sm flex items-center gap-x-1'>
                      <LucideCornerLeftUp size={16} />
                      {row.mode}
                    </p>
                    {/* Mode */}
                  </div>
                </div>
                {row.credit ? (
                  <span className='text-green-600 text-right dark:text-green-400 font-bold'>
                    {`+${formattedAmount(row.credit, true)}`}
                  </span>
                ) : row.debit ? (
                  <span className='text-red-600 text-right dark:text-red-400 font-bold'>
                    {`-${formattedAmount(row.debit, true)}`}
                  </span>
                ) : (
                  <span className='font-bold'>0</span>
                )}
              </section>
            </section>
          );
        })}
      </div>
    </PageWrapper>
  );
}

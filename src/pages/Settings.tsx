import PageWrapper from '@/components/layout/PageWrapper';
import passbook from '@/utils/Passbook';
import { useEffect } from 'react';
import { bank } from './temp/temp';

export default function Settings() {
  useEffect(() => {
    const rows = passbook(bank);
    // const temp = rows.map((item) => {
    //   return {
    //     date: format(item.date, 'dd-MMM-yyyy'),
    //     to: item.to,
    //     info: item.details,
    //   };
    // });
    // console.table(rows);
    // if (rows) {
    //   console.table(
    //     rows.map(({ credit, debit, balance, date, receiver }) => {
    //       return { date, balance, credit, debit, receiver };
    //     })
    //   );
    // }
  }, []);

  return (
    <PageWrapper>
      <h1>Settings</h1>
    </PageWrapper>
  );
}

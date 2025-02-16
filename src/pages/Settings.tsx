import PageWrapper from '@/components/layout/PageWrapper';
import passbook from '@/utils/Passbook';
import { useEffect } from 'react';
import { bank } from './temp/temp';

export default function Settings() {
  useEffect(() => {
    const rows = passbook(bank);
  }, []);

  return (
    <PageWrapper>
      <h1>Settings</h1>
    </PageWrapper>
  );
}

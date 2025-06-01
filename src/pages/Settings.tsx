import PageWrapper from '@/components/layout/PageWrapper';
import passbook from '@/utils/Passbook';
import { useEffect } from 'react';
import { union } from './temp/temp';

export default function Settings() {
  useEffect(() => {
    const test = passbook(union);
    console.log(test);
  }, []);

  return (
    <PageWrapper>
      <h1>Settings</h1>
    </PageWrapper>
  );
}

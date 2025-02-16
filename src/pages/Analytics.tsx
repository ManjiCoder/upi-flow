import FlowInfo from '@/components/FlowInfo';
import FrequentTranscactionTable from '@/components/FrequentTranscactionTable';
import PageWrapper from '@/components/layout/PageWrapper';
import { LineGraph } from '@/components/LineGraph';
import { useAppSelector } from '@/redux/hooks';
import { frequentTranscation } from '@/utils/helper';

export default function Analytics() {
  const { filterData } = useAppSelector((state) => state.dateSlice);
  const records = frequentTranscation(Object.values(filterData).flat()).sort(
    (a, b) => b.count - a.count
  );
  return (
    <PageWrapper className='pt-0'>
      <FlowInfo />
      <LineGraph />
      <FrequentTranscactionTable records={records} />
    </PageWrapper>
  );
}

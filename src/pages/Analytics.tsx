import FlowInfo from '@/components/FlowInfo';
import FrequentTranscactionTable from '@/components/FrequentTranscactionTable';
import PageWrapper from '@/components/layout/PageWrapper';
import { LineGraph } from '@/components/LineGraph';

export default function Analytics() {
  return (
    <PageWrapper className='pt-0'>
      <FlowInfo />
      <LineGraph />
      <FrequentTranscactionTable />
    </PageWrapper>
  );
}

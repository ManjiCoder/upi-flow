import FlowInfo from '@/components/FlowInfo';
import PageWrapper from '@/components/layout/PageWrapper';
import { LineGraph } from '@/components/LineGraph';

export default function Analytics() {
  return (
    <PageWrapper className='pt-0'>
      <FlowInfo />
      <LineGraph />
    </PageWrapper>
  );
}

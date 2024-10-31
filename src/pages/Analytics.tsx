import FlowInfo from '@/components/FlowInfo';
import PageWrapper from '@/components/layout/PageWrapper';
import { LineGraph } from '@/components/LineGraph';
import { useAppSelector } from '@/redux/hooks';
import { Transaction } from '@/types/constant';

const generateChartData = (
  data:
    | {}
    | {
        [timeStamp: string]: Transaction[];
      }
) => {
  // console.log(data);
  return data;
};
export default function Analytics() {
  const { filterData } = useAppSelector((state) => state.dateSlice);

  const chartData1 = Object.entries(filterData).map(([key, item]) => {
    return item.map((item) => item.credit).filter(Boolean);
  });
  console.log(chartData1);
  return (
    <PageWrapper className='pt-0'>
      <FlowInfo />
      <LineGraph />
    </PageWrapper>
  );
}

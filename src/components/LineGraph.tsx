'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useAppSelector } from '@/redux/hooks';
import { formatNumber, frequentTranscation, getTotal } from '@/utils/helper';
import { format } from 'date-fns';

export const description = 'A line chart with a label';

// const chartData = [
//   { month: 'January', desktop: 186, mobile: 80 },
//   { month: 'February', desktop: 305, mobile: 200 },
//   { month: 'March', desktop: 237, mobile: 120 },
//   { month: 'April', desktop: 73, mobile: 190 },
//   { month: 'May', desktop: 209, mobile: 130 },
//   { month: 'June', desktop: 214, mobile: 140 },
// ];

const chartConfig = {
  desktop: {
    label: 'credit',
    color: '#22c55e',
  },
  mobile: {
    label: 'debit',
    color: '#ef4444',
  },
} satisfies ChartConfig;

export function LineGraph() {
  const { filterData } = useAppSelector((state) => state.dateSlice);
  const records = Object.values(filterData).flat();
  console.table(frequentTranscation(records))
  const chartData = Object.entries(filterData).map(([key, item]) => {
    return {
      key: format(key, 'dd-MMM-yyyy'),
      credit: item
        .map((item) => item.credit)
        .filter(Boolean)
        .reduce(getTotal, 0),
      debit: item
        .map((item) => item.debit)
        .filter(Boolean)
        .reduce(getTotal, 0),
    };
  });
  return (
    <Card>
      <CardHeader>
        {/* <CardTitle className='text-center'>{showDate}</CardTitle> */}
        {/* <CardDescription>{showDate}</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey='key'
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              tickFormatter={(value) => format(value, 'MMM d')}
            />
            <YAxis
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              // @ts-ignore
              tickFormatter={formatNumber}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Bar dataKey='credit' fill='var(--color-desktop)' radius={4}>
              {/* <LabelList
                position='top'
                offset={12}
                className='fill-foreground'
                formatter={formatNumber}
              /> */}
            </Bar>
            <Bar dataKey='debit' fill='var(--color-mobile)' radius={4}>
              {/* <LabelList
                position='top'
                offset={5}
                className='fill-foreground'
                formatter={formatNumber}
              /> */}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}

'use client';

import { TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useAppSelector } from '@/redux/hooks';
import { FilterOption } from '@/types/constant';
import { formattedAmount, getTotal } from '@/utils/helper';
import { addMonths, endOfWeek, format, startOfWeek } from 'date-fns';
import { useMemo } from 'react';

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
    color: '#ef4444',
  },
  mobile: {
    label: 'debit',
    color: '#22c55e',
  },
} satisfies ChartConfig;

export function LineGraph() {
  const { filterData, dateFilter } = useAppSelector((state) => state.dateSlice);
  const { filter } = useAppSelector((state) => state.filter);
  // console.log(filterData);
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
        <CardTitle>Line Chart - Label</CardTitle>
        <CardDescription>{showDate}</CardDescription>
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
            <CartesianGrid vertical={false} />
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
              tickFormatter={(value) => formattedAmount(value, true)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey='credit' fill='var(--color-desktop)' radius={4}>
              <LabelList
                position='top'
                offset={12}
                className='fill-foreground'
                fontSize={10}
              />
            </Bar>
            <Bar dataKey='debit' fill='var(--color-mobile)' radius={4}>
              <LabelList
                position='top'
                offset={12}
                className='fill-foreground'
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

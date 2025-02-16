import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppSelector } from '@/redux/hooks';
import { frequentTranscation } from '@/utils/helper';

export default function FrequentTranscactionTable() {
  const { filterData } = useAppSelector((state) => state.dateSlice);
  const records = frequentTranscation(Object.values(filterData).flat()).sort(
    (a, b) => b.count - a.count
  );
  console.log(records);
  return (
    <Table className='overflow-hidden'>
      <TableCaption>A list of Frequent Transcation.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className=''>Receiver</TableHead>
          <TableHead>Count</TableHead>
          <TableHead>Credit</TableHead>
          <TableHead className='text-right'>Debit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((item) => (
          <TableRow key={item.name}>
            <TableCell className='font-medium'>{item.name}</TableCell>
            <TableCell>{item.count}</TableCell>
            <TableCell>{item.credit || ''}</TableCell>
            <TableCell className='text-right'>{item.debit || ''}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

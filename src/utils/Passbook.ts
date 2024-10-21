import { banks, PaymentModes } from '@/types/constant';
import { isValid, parse } from 'date-fns';

interface Transaction {
  date?: string;
  mode?: string;
  details?: string;
  credit?: string;
  debit?: string;
  balance?: string;
  refNo?: number | null;
  amt?: string;
}

const isValidDate = (dateStr: string) => {
  const parsedDate = parse(dateStr, 'dd-MM-yyyy', new Date());
  return isValid(parsedDate);
};

const extractRow = (arr: string[]) => {
  const payload: Transaction = {};
  const n = arr.length;
  payload.date = arr[0]; // Setting Date
  payload.balance = arr[n - 1]; // Setting Balance

  // Setting Details
  const details = arr
    .slice(1, n - 2)
    .filter((str) => /[a-z]/i.test(str))
    .join('');
  payload.details = details;

  // Setting referral number of transaction
  const refNo = details
    .split('/')
    .filter((char) => !/[a-z]/i.test(char))
    .join('');
  if (refNo.length !== 0) {
    payload.refNo = parseFloat(refNo);
  }

  // Setting Mode of Transaction
  const mode = Object.values(PaymentModes).find((method) =>
    details.toLowerCase().includes(method.toLowerCase())
  );
  if (mode) {
    payload.mode = mode;
  }

  // Setting Amount
  const amt = arr.slice(1, n).find((str) => !/[a-z]/i.test(str));
  if (amt) {
    payload.amt = amt;
  }

  return payload;
};

export const generateICICIRecords = (str: string) => {
  try {
    const transactions: Transaction[] = [];
    const dateIdx: number[] = [];

    const target =
      '\nDATE\n \nMODE**\n \nPARTICULARS\n \nDEPOSITS\n \nWITHDRAWALS\n \nBALANCE\n';
    const isTarget = str.includes(target);
    if (!isTarget) throw new Error('Invalid records!');
    const startIdx = str.indexOf(target) + target.length;
    const newStr = str.slice(startIdx, str.length);

    // lines is like collection of transacition in the table
    const lines = newStr
      .trim()
      .split('\n')
      .filter((str) => !['', ' '].includes(str));

    // Setting index of valid dates
    lines.forEach((val, i) => {
      if (isValidDate(val)) {
        dateIdx.push(i);
      }
    });

    for (let i = 0; i < dateIdx.length; i++) {
      let j = i - 1;
      const currLine = dateIdx[i];
      const prevLine = dateIdx[j];
      const currDate = lines[dateIdx[i]];
      const prevDate = lines[dateIdx[j]];

      if (!prevLine) {
        // const nextLine = dateIdx[i - 1];
        // const arr = lines.slice(currLine, nextLine);
        // console.log(currLine, prevLine);
        // const rowData = extractRow(arr);
        // transactions.push(rowData);
      } else {
        console.log(prevDate, currDate, prevLine, currLine);
        const arr = lines.slice(prevLine, currLine);
        const rowData = extractRow(arr);
        transactions.push(rowData);
      }
    }
    return transactions;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Main Function
function passbook(str: string) {
  if (str.includes(banks.icici)) {
    return generateICICIRecords(str);
  } else if (str.includes(banks.sbi)) {
    // TODO: SBI Function
  }
}

export default passbook;

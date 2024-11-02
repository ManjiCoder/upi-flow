import { banks, PaymentModes, Transaction } from '@/types/constant';
import { parse } from 'date-fns';
import { emptyCheck, isValidDate, stringToNumber } from './helper';

// ICICI
const extractRow = (arr: string[], id: number, bankId: number) => {
  const payload: Transaction = {
    id,
    date: '',
    balance: 0,
  };
  const n = arr.length;
  payload.date = parse(arr[0], 'dd-MM-yyyy', new Date()).toISOString(); // Setting Date
  payload.balance = stringToNumber(arr[n - 1]); // Setting Balance
  payload.bankId = bankId;

  // Setting Details
  const details = arr
    .slice(1, n - 2)
    .filter((str) => /[a-z]/i.test(str))
    .join('');
  payload.details = details;

  if (details.trim().length === 0) {
    payload.details = arr
      .slice(1, n)
      .filter((str) => /[a-z]/i.test(str))
      .join('');
  }

  // Setting referral number of transaction
  const refNo = details.includes(':')
    ? details.split(':')[0]
    : details
        .split('/')
        .filter((char) => !/[a-z]|[-\/]/i.test(char))
        .join('');

  if (refNo.length !== 0) {
    payload.refNo = refNo;
  }

  // Setting Mode of Transaction
  const mode = Object.keys(PaymentModes).find((method) =>
    arr
      .slice(1, n - 2)
      .join('')
      .toLowerCase()
      .includes(method.replaceAll('_', '').toLowerCase())
  );

  if (mode) {
    // @ts-ignore
    payload.mode = PaymentModes[mode];
    // @ts-ignore
    if (PaymentModes[mode] === PaymentModes.CASH) {
      if (refNo.trim().length === 0) {
        payload.refNo = details.split('/')[1];
      }
    }
  }

  // Setting Amount
  const amt = arr.slice(1, n).find((str) => !/[a-z]|[-\\/]/i.test(str));
  if (amt) {
    payload.amt = stringToNumber(amt);
  }
  const receiver = details.split('/').filter((str) => str.includes('@'));
  if (receiver.length !== 0) {
    const arr = details.split('/');
    if (!/[a-z]/i.test(arr[1])) {
      payload.to = arr[3];
    } else {
      payload.to = arr[1];
    }
  }
  if (receiver.length === 0) {
    const arr = details.split('/');
    if (!/[a-z]/i.test(arr[1])) {
      payload.to = arr[3];
    } else {
      payload.to = arr[1];
    }
  }

  if (!payload.to) {
    if (payload.mode === PaymentModes.Int) {
      payload.to = 'Self';
    }
  }
  return payload;
};

const generateICICIRecords = (str: string, bankId: number, lastId: number) => {
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
      .filter(emptyCheck())
      .flatMap((str) => str.split(' '));

    // Setting index of valid dates
    lines.forEach((val, i) => {
      if (isValidDate(val) && /[a-z]/i.test(lines[i + 1])) {
        dateIdx.push(i);
      }
    });
    // console.log(lines);

    for (let i = 0; i < dateIdx.length; i++) {
      let j = i + 1;
      const currLine = dateIdx[i];
      const nextLine = dateIdx[j];

      if (!nextLine) {
        let counter = 0;
        let lastBal = 0;
        lines.slice(currLine + 1, currLine + 20).filter((str, idx) => {
          if (!/[a-z]|[-\\/]/i.test(str)) {
            counter += 1;
            if (counter === 2) {
              lastBal = currLine + 1 + idx;
            }
          }
        });
        const arr = lines.slice(currLine, lastBal + 1);
        const rowData = extractRow(
          arr,
          lastId + transactions.length + 1,
          bankId
        );
        transactions.push(rowData);
      } else {
        let arr = lines.slice(currLine, nextLine);
        if (arr.includes('Page')) {
          // @ts-ignore
          arr = arr.slice(arr, arr.indexOf('Page'));
        }
        const rowData = extractRow(
          arr,
          lastId + transactions.length + 1,
          bankId
        );
        transactions.push(rowData);
      }
    }

    // Settings credit or debit
    for (let i = 0; i < transactions.length; i++) {
      let j = i - 1;
      const currRow = transactions[i];
      const prevRow = transactions[j];
      if (!prevRow) {
        // @ts-ignore
        if (currRow.balance < transactions[i + 1].balance) {
          currRow.credit = currRow.amt;
        } else {
          currRow.debit = currRow.amt;
        }
      } else {
        // @ts-ignore
        if (currRow.balance > prevRow.balance) {
          currRow.credit = currRow.amt;
        } else {
          currRow.debit = currRow.amt;
        }
      }
      delete currRow.amt;
    }
    // console.table(dateIdx.map((str) => lines[str]));
    // console.log(transactions.filter(({ to }) => !to));
    return transactions;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Paytm
const extractRowPaytm = (arr: string[], id: number, bankId: number) => {
  const payload: Transaction = {
    id: 0,
    date: '',
    balance: 0,
    mode: 'upi',
  };
  const n = arr.length;
  const date = new Date(arr.slice(0, 2).join()).toISOString();
  payload.date = date; // setting date
  payload.details = arr[arr.length - 1]; // settings details
  payload.balance = stringToNumber(arr[n - 2].replace('Rs.', '')); // settings balance
  payload.amt = stringToNumber(arr[n - 3].replace('Rs.', '')); // settings amount

  // setting credit or debit
  const plusOrMinusIdx = arr.findIndex((line) => line === '+' || line === '-');
  const plusOrMinus = arr[plusOrMinusIdx];

  const amt = arr[plusOrMinusIdx + 1];
  const balance = arr[plusOrMinusIdx + 2];
  const details = arr[plusOrMinusIdx + 3];

  if (amt) {
    payload.amt = stringToNumber(amt.replace('Rs.', ''));
  }
  if (balance) {
    payload.balance = stringToNumber(balance.replace('Rs.', ''));
  }
  if (details) {
    payload.details = details;
  }
  if (plusOrMinus === '+') {
    payload.credit = payload.amt;
  } else if (plusOrMinus === '-') {
    payload.debit = payload.amt;
  }
  // setting refNo
  const refNo = arr.find((line) => /Reference Number/.test(line));
  if (refNo) {
    payload.refNo = refNo.split(': ')[1];
  }
  if (!refNo) {
    const transactionId = arr.find((line) => /Transaction ID/.test(line));
    payload.refNo = transactionId?.split(': ')[1];
  }

  // setting to receiver
  const receiver = arr.find((line) => /VPA/.test(line));
  if (receiver) {
    payload.to = receiver.split(': ')[1];
  }

  const mode = Object.keys(PaymentModes).find((method) =>
    arr[2].includes(method.replaceAll('_', '').toLowerCase())
  );

  if (mode) {
    // @ts-ignore
    payload.mode = PaymentModes[mode];
  }

  payload.id = id;
  payload.bankId = bankId;
  if (!receiver) {
    const isSendOrReceive = details.split(': ')[1];
    if (isSendOrReceive) {
      payload.to = isSendOrReceive;
    }
    if (!isSendOrReceive) {
      try {
        payload.to = details.split('at ')[1] || details.split('from ')[1];
        if (!payload.to) {
          payload.to = details;
        }
      } catch (error) {
        payload.to = details;
      }
    }
  }
  payload.receiver = payload.details;
  // console.log(payload);
  return payload;
};
const generatePaytmRecords = (str: string, bankId: number, lastId: number) => {
  try {
    const transactions: Transaction[] = [];
    const dateIdx: number[] = [];
    const target =
      '\nDATE & TIME\n \nTRANSACTION DETAILS\n \nAMOUNT\n \nAVAILABLE BALANCE\n';
    const isTarget = str.includes(target);
    if (!isTarget) throw new Error('Invalid records!');
    const startIdx = str.indexOf(target) + target.length;
    const newStr = str.slice(startIdx, str.length);
    const lines = newStr.split('\n').filter(emptyCheck());
    lines.forEach((line, i) => {
      if (isValidDate(line, 'dd MMM yyyy')) {
        dateIdx.push(i);
      }
    });

    for (let i = 0; i < dateIdx.length; i++) {
      let j = i + 1;
      const currLine = dateIdx[i];
      const nextLine = dateIdx[j];

      if (!nextLine) {
        // console.log(currLine, nextLine);
        const plusOrMinusIdx = lines.findIndex(
          (line) => line === '+' || line === '-'
        );
        const arr = lines.slice(currLine, currLine + plusOrMinusIdx + 3);
        const row = extractRowPaytm(arr, lastId + transactions.length, bankId);
        transactions.push(row);
      } else {
        const arr = lines.slice(currLine, nextLine);
        const plusOrMinusIdx = arr.findIndex(
          (line) => line === '+' || line === '-'
        );
        const newArr = arr.slice(0, plusOrMinusIdx + 4);
        const row = extractRowPaytm(
          newArr,
          lastId + transactions.length,
          bankId
        );
        transactions.push(row);
      }
    }

    // console.log(transactions.filter(({ to }) => !to));
    // console.log(dateIdx.map((val) => lines[val]));
    // @ts-ignore
    return transactions;
  } catch (error) {
    return false;
  }
};

// SBI
const extractRowSbi = (arr: string[], id: number, bankId: number) => {
  const date = parse(arr[2], 'dd MMM yyyy', new Date()).toISOString();
  const credit = arr[0];
  const debit = arr[1];
  const balance = arr[arr.length - 1];
  const details = arr.slice(3, arr.length - 1).join(' ');
  const detailsArr = details.split('/');
  const refNoIdx = detailsArr.findIndex((str) => !/[a-z]/i.test(str));
  const refNo = detailsArr[refNoIdx];
  const payload: Transaction = {
    id,
    date,
    balance: 0,
    bankId,
    details,
  };
  if (credit !== '-') {
    payload.credit = stringToNumber(credit);
  }
  if (debit !== '-') {
    payload.debit = stringToNumber(debit);
  }
  if (balance) {
    payload.balance = stringToNumber(balance);
  }
  if (![' ', '', undefined].includes(refNo)) {
    payload.refNo = refNo;
    const receiver = detailsArr.slice(refNoIdx + 1);
    receiver.pop();
    payload.receiver = receiver.join(' ');
  } else {
    payload.receiver = details;
  }
  // console.log(balance, date);
  return payload;
};
const generateSBIRecords = (str: string, bankId: number, lastId: number) => {
  // Steps date, rows, push
  try {
    const transactions: Transaction[] = [];
    const dateIdx: number[] = [];
    const target =
      'Date\n \nCredit\n \nBalance\nDetails\n \nRef No./Cheque\nNo\nDebit';
    const isTarget = str.includes(target);
    if (!isTarget) throw new Error('Invalid records!');
    const startIdx = str.indexOf(target) + target.length;
    const newStr = str.slice(startIdx, str.length).replaceAll(target, '\n');
    const lines = newStr.split('\n').filter(emptyCheck());
    lines.forEach((line, i) => {
      if (isValidDate(line, 'dd MMM yyyy')) {
        dateIdx.push(i);
      }
    });

    for (let i = 0; i < dateIdx.length; i++) {
      let j = i + 1;
      const currLine = dateIdx[i];
      const nextLine = dateIdx[j];
      if (!nextLine) {
        const arr = lines.slice(currLine - 2);
        const lastLine = JSON.parse(JSON.stringify(arr))
          .reverse()
          .findIndex((str: string) => !/[a-z]/i.test(str));

        const newArr = arr.slice(0, arr.length - lastLine);
        const row = extractRowSbi(newArr, lastId + transactions.length, bankId);
        // console.log(row, newArr);
        transactions.unshift(row);
      } else {
        const arr = lines.slice(currLine - 2, nextLine - 2);
        const row = extractRowSbi(arr, lastId + transactions.length, bankId);
        transactions.unshift(row);
      }
    }

    // console.log(dateIdx.map((idx) => lines[idx]));
    // console.log(transactions);
    return transactions;
  } catch (error) {
    return false;
  }
};
// Main Function
function passbook(str: string, lastId = 0) {
  if (str.includes(banks.icici.name)) {
    return generateICICIRecords(str, banks.icici.id, lastId);
  } else if (str.includes(banks.sbi.name)) {
    return generateSBIRecords(str, banks.sbi.id, lastId);
  } else if (str.includes(banks.paytm.name)) {
    return generatePaytmRecords(str, banks.paytm.id, lastId);
  }
}

export default passbook;

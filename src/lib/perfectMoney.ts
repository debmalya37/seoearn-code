import axios from 'axios';

const PM_ACCOUNT_ID = process.env.NEXT_PUBLIC_PM_ACCOUNT_ID;
const PM_PASSWORD = process.env.NEXT_PUBLIC_PM_PASSWORD;
const PM_USD_ACCOUNT = process.env.NEXT_PUBLIC_PM_USD_ACCOUNT;

export const getBalance = async () => {
  const response = await axios.get(`https://perfectmoney.com/acct/balance.asp?AccountID=${PM_ACCOUNT_ID}&PassPhrase=${PM_PASSWORD}`);
  const result: { [key: string]: string } = {};

  response.data.split('\n').forEach((line: string) => {
    const match = line.match(/<input name='(.*)' type='hidden' value='(.*)'>/);
    if (match) {
      result[match[1]] = match[2];
    }
  });

  return result;
};

export const transferFunds = async (payerAccount: string, payeeAccount: string, amount: number, paymentId: string) => {
  const response = await axios.get(`https://perfectmoney.com/acct/confirm.asp?AccountID=${PM_ACCOUNT_ID}&PassPhrase=${PM_PASSWORD}&Payer_Account=${payerAccount}&Payee_Account=${payeeAccount}&Amount=${amount}&PAYMENT_ID=${paymentId}`);
  const result: { [key: string]: string } = {};

  response.data.split('\n').forEach((line: string) => {
    const match = line.match(/<input name='(.*)' type='hidden' value='(.*)'>/);
    if (match) {
      result[match[1]] = match[2];
    }
  });

  return result;
};

export const createVoucher = async (amount: number) => {
  const response = await axios.get(`https://perfectmoney.com/acct/ev_create.asp?AccountID=${PM_ACCOUNT_ID}&PassPhrase=${PM_PASSWORD}&Payer_Account=${PM_USD_ACCOUNT}&Amount=${amount}`);
  const result: { [key: string]: string } = {};

  response.data.split('\n').forEach((line: string) => {
    const match = line.match(/<input name='(.*)' type='hidden' value='(.*)'>/);
    if (match) {
      result[match[1]] = match[2];
    }
  });

  return result;
};

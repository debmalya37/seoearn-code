import axios from 'axios';

const PERFECT_MONEY_API_URL = 'https://perfectmoney.is/acct/confirm.asp';

export interface PaymentRequestParams {
  accountId: string;
  passPhrase: string;
  payerAccount: string;
  payeeAccount: string;
  amount: number;
  memo: string;
}

export const depositMoney = async (params: PaymentRequestParams) => {
  const { accountId, passPhrase, payerAccount, payeeAccount, amount, memo } = params;

  const response = await axios.post(PERFECT_MONEY_API_URL, null, {
    params: {
      AccountID: accountId,
      PassPhrase: passPhrase,
      Payer_Account: payerAccount,
      Payee_Account: payeeAccount,
      Amount: amount,
      Memo: memo,
    },
  });

  return response.data;
};

export const withdrawMoney = async (params: PaymentRequestParams) => {
  // Assuming similar API interaction for withdrawal
  const response = await axios.post(PERFECT_MONEY_API_URL, null, {
    params: {
      AccountID: params.accountId,
      PassPhrase: params.passPhrase,
      Payer_Account: params.payerAccount,
      Payee_Account: params.payeeAccount,
      Amount: params.amount,
      Memo: params.memo,
    },
  });

  return response.data;
};

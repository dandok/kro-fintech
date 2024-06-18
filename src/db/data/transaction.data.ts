import { ETransactionType } from '../../@types/transaction.enum';

const transactions = [
  {
    amount: -80,
    description: 'grocery store',
    type: ETransactionType.DEBIT,
    balance: 4920,
    payment_method: 'pos',
    ref: '#1',
  },
];

export default transactions;

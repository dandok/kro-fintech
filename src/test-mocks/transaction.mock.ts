export const userId = 1;
export const searchParams = { page: 1, limit: 10 };

export const mockTransactions = [
  { id: 1, amount: 100 },
  { id: 2, amount: 200 },
];
export const mockCount = 2;

export const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  getManyAndCount: jest
    .fn()
    .mockResolvedValueOnce([mockTransactions, mockCount]),
};

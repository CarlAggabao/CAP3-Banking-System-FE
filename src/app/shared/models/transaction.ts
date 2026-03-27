export interface Transaction {
    id: number;
    senderAccountNumber: string;
    receiverAccountNumber: string;
    amount: number;
    transactionType: string;
    transactionCost: number;
    status: string;
    transactionDescription: string;
    createdAt: string;
}

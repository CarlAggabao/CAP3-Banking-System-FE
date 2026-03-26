export interface TransactionRequest {
    senderAccountNumber: string;
    receiverAccountNumber: string;
    amount: number;
    transactionDescription: string;
}
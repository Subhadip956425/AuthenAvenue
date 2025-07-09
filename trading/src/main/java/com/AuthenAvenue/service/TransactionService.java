package com.AuthenAvenue.service;

import com.AuthenAvenue.domain.WalletTransactionType;
import com.AuthenAvenue.modal.Wallet;
import com.AuthenAvenue.modal.WalletTransaction;

import java.util.List;

public interface TransactionService {

    /**
     * Retrieves a list of transactions for the specified wallet.
     *
     * @param wallet The wallet for which transactions are to be fetched.
     * @return A list of WalletTransaction objects.
     */
    List<WalletTransaction> getTransactionsByWallet(Wallet wallet);

    /**
     * Creates a new transaction for the specified wallet.
     *
     * @param wallet The wallet to which the transaction belongs.
     * @param type The type of the transaction (e.g., DEPOSIT, WITHDRAWAL).
     * @param transactionId An optional transaction ID for external references.
     * @param purpose The purpose or description of the transaction.
     * @param amount The amount involved in the transaction.
     * @return The created WalletTransaction object.
     */
    WalletTransaction createTransaction(Wallet wallet, WalletTransactionType type, String transactionId, String purpose, Long amount);
}

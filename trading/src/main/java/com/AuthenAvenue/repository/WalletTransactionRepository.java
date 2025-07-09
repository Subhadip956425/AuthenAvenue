package com.AuthenAvenue.repository;

import com.AuthenAvenue.modal.Wallet;
import com.AuthenAvenue.modal.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
    List<WalletTransaction> findByWallet(Wallet wallet);
}

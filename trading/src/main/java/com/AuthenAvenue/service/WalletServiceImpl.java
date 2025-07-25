package com.AuthenAvenue.service;

import com.AuthenAvenue.domain.OrderType;
import com.AuthenAvenue.domain.WalletTransactionType;
import com.AuthenAvenue.modal.Order;
import com.AuthenAvenue.modal.User;
import com.AuthenAvenue.modal.Wallet;
import com.AuthenAvenue.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Service
public class WalletServiceImpl implements WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionService transactionService;

    @Override
    public Wallet getUserWallet(User user) {
            Wallet wallet = walletRepository.findByUserId(user.getId());
            if(wallet == null) {
                wallet = new Wallet();
                wallet.setUser(user);
                walletRepository.save(wallet);
            }
        return wallet;
    }

    @Override
    public Wallet addBalance(Wallet wallet, Long money) {
        BigDecimal balance = wallet.getBalance();
        BigDecimal newBalance = balance.add(BigDecimal.valueOf(money));

        wallet.setBalance(newBalance);

        return walletRepository.save(wallet);
    }

    @Override
    public Wallet findWalletById(Long id) throws Exception {
        Optional<Wallet> wallet = walletRepository.findById(id);
        if(wallet.isPresent()) {
            return wallet.get();
        }
        throw new Exception("Wallet not found");
    }

    @Override
    public Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, Long amount) throws Exception {
        Wallet senderWallet = getUserWallet(sender);

        if(senderWallet.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new Exception("Insufficient balance...");
        }
//        BigDecimal senderBalance = senderWallet.getBalance().subtract(BigDecimal.valueOf(amount));
//        senderWallet.setBalance(senderBalance);
//        walletRepository.save(senderWallet);
//
//        BigDecimal receiverBalance = receiverWallet.getBalance().add(BigDecimal.valueOf(amount));
//        receiverWallet.setBalance(receiverBalance);
//        walletRepository.save(receiverWallet);
//
//        return senderWallet;

        // Transfer logic
        senderWallet.setBalance(senderWallet.getBalance().subtract(BigDecimal.valueOf(amount)));
        receiverWallet.setBalance(receiverWallet.getBalance().add(BigDecimal.valueOf(amount)));

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        // Create a unique transactionId
        String transactionId = UUID.randomUUID().toString();

        // Create transaction logs
        transactionService.createTransaction(senderWallet, WalletTransactionType.WALLET_TRANSFER, transactionId, "Sent to wallet ID: " + receiverWallet.getId(), amount);
        transactionService.createTransaction(receiverWallet, WalletTransactionType.WALLET_TRANSFER, transactionId, "Received from wallet ID: " + senderWallet.getId(), amount);

        return senderWallet;


    }

    @Override
    public Wallet payOrderPayment(Order order, User user) throws Exception {
        Wallet wallet = getUserWallet(user);

        if(order.getOrderType().equals(OrderType.BUY)) {
            BigDecimal newBalance = wallet.getBalance().subtract(order.getPrice());
            if(newBalance.compareTo(order.getPrice()) < 0) {
                throw new Exception("Insufficient funds for this transaction");
            }
            wallet.setBalance(newBalance);
        }
        else {
            BigDecimal newBalance = wallet.getBalance().add(order.getPrice());
            wallet.setBalance(newBalance);
        }
        walletRepository.save(wallet);
        return wallet;
    }
}

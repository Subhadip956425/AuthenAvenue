package com.AuthenAvenue.controller;

import com.AuthenAvenue.domain.WalletTransactionType;
import com.AuthenAvenue.modal.*;
import com.AuthenAvenue.request.WalletTransferRequest;
import com.AuthenAvenue.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
public class WalletController {

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/api/wallet")
    public ResponseEntity<Wallet> getUserWallet(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
//        User user = userService.findUserProfileByJwt(jwt.replace("Bearer ", ""));

        Wallet wallet = walletService.getUserWallet(user);

        return new ResponseEntity<>(wallet, HttpStatus.ACCEPTED);
    }

//    @PutMapping("/api/wallet/{walletId}/transfer")
//    public ResponseEntity<Wallet> walletToWalletTransfer(@RequestHeader("Authorization") String jwt, @PathVariable Long walletId, @RequestBody WalletTransaction req) throws Exception {
//        User senderUser = userService.findUserProfileByJwt(jwt);
//        Wallet receiverWallet = walletService.findWalletById(walletId);
//        Wallet wallet = walletService.walletToWalletTransfer(senderUser, receiverWallet, req.getAmount());
//
//        return new ResponseEntity<>(wallet, HttpStatus.ACCEPTED);
//    }

    @PutMapping("/api/wallet/{walletId}/transfer")
    public ResponseEntity<Wallet> walletToWalletTransfer(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long walletId,
            @RequestBody WalletTransferRequest req) throws Exception {

        User senderUser = userService.findUserProfileByJwt(jwt);
        Wallet receiverWallet = walletService.findWalletById(walletId);
        Wallet wallet = walletService.walletToWalletTransfer(senderUser, receiverWallet, req.getAmount());

        return new ResponseEntity<>(wallet, HttpStatus.ACCEPTED);
    }



    @PutMapping("/api/wallet/order/{orderId}/pay")
    public ResponseEntity<Wallet> payOrderPayment(@RequestHeader("Authorization") String jwt, @PathVariable Long orderId) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);


        Order order = orderService.getOrderById(orderId);

        Wallet wallet = walletService.payOrderPayment(order, user);

        return new ResponseEntity<>(wallet, HttpStatus.ACCEPTED);
    }

    @PutMapping("/api/wallet/deposit")
    public ResponseEntity<Wallet> addBalanceToWallet(@RequestHeader("Authorization") String jwt, @RequestParam(name="order_id") Long orderId, @RequestParam(name = "payment_id") String paymentId) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        Wallet wallet = walletService.getUserWallet(user);

        PaymentOrder order = paymentService.getPaymentOrderById(orderId);

        Boolean status = paymentService.ProceedPaymentOrder(order, paymentId);

        if (!status) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // 🛑 Check if this paymentId already has a transaction to prevent duplication
        boolean alreadyExists = transactionService.existsByTransferId(paymentId); // You implement this

        if (alreadyExists) {
            return new ResponseEntity<>(wallet, HttpStatus.OK); // prevent double-deposit
        }


        if(wallet.getBalance()==null) {
            wallet.setBalance(BigDecimal.valueOf(0));
        }

//        if(status) {
//            wallet = walletService.addBalance(wallet, order.getAmount());


        if (status) {
            // Convert the amount from paise to INR and ensure it's a Long
            Long amountInBaseUnit = order.getAmount() / 100;

            // Add converted amount to wallet
            wallet = walletService.addBalance(wallet, amountInBaseUnit);             ///////////////////////

            transactionService.createTransaction(
                    wallet,
                    WalletTransactionType.ADD_MONEY,
                    paymentId,
                    "Wallet Top-up",
                    amountInBaseUnit);

        }


        return new ResponseEntity<>(wallet, HttpStatus.ACCEPTED);
    }
}

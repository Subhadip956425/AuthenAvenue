package com.AuthenAvenue.controller;

import com.AuthenAvenue.modal.PaymentDetails;
import com.AuthenAvenue.modal.User;
import com.AuthenAvenue.service.PaymentDetailsService;
import com.AuthenAvenue.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PaymentDetailsController {

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentDetailsService paymentDetailsService;

    @PostMapping("/payment-details")
    public ResponseEntity<PaymentDetails> addPaymentDetails(@RequestBody PaymentDetails paymentDetailsRequest, @RequestHeader("Authorization") String jwt) throws Exception {
        if (jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
        }

        User user = userService.findUserProfileByJwt(jwt);

        PaymentDetails paymentDetails = paymentDetailsService.addPaymentDetails(paymentDetailsRequest.getAccountNumber(), paymentDetailsRequest.getAccountHolderName(), paymentDetailsRequest.getIfsc(), paymentDetailsRequest.getBankName(), user);

        return new ResponseEntity<>(paymentDetails, HttpStatus.CREATED);
    }

    @PutMapping("/payment-details/{id}")
    public ResponseEntity<PaymentDetails> updatePaymentDetails(
            @PathVariable Long id,
            @RequestBody PaymentDetails updatedDetails,
            @RequestHeader("Authorization") String jwt) throws Exception {

        if (jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
        }

        User user = userService.findUserProfileByJwt(jwt);

        PaymentDetails paymentDetails = paymentDetailsService.updatePaymentDetails(id, updatedDetails, user);

        return new ResponseEntity<>(paymentDetails, HttpStatus.OK);
    }


    @GetMapping("/payment-details")
    public ResponseEntity<PaymentDetails> getUserPaymentDetails(@RequestHeader("Authorization") String jwt) throws Exception {
        if (jwt.startsWith("Bearer ")) {
            jwt = jwt.substring(7);
        }

        User user = userService.findUserProfileByJwt(jwt);

        PaymentDetails paymentDetails = paymentDetailsService.getUsersPaymentDetails(user);

        return new ResponseEntity<>(paymentDetails, HttpStatus.OK);
    }
}

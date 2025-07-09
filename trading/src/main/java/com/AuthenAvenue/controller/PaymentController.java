////////////////////////////

package com.AuthenAvenue.controller;

import com.AuthenAvenue.domain.PaymentMethod;
import com.AuthenAvenue.modal.PaymentOrder;
import com.AuthenAvenue.modal.User;
import com.AuthenAvenue.response.PaymentResponse;
import com.AuthenAvenue.service.PaymentService;
import com.AuthenAvenue.service.UserService;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class PaymentController {

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/api/payment/{paymentMethod}/amount/{amount}")
    public ResponseEntity<PaymentResponse> paymentHandler(@PathVariable PaymentMethod paymentMethod, @PathVariable Long amount, @RequestHeader("Authorization") String jwt) throws Exception, RazorpayException, StripeException {
        User user = userService.findUserProfileByJwt(jwt);

        PaymentResponse paymentResponse;


        // Convert amount to the smallest currency unit (paise)
        Long amountInSmallestUnit = amount * 100; // Convert ₹ to paise

        // Create payment order
        PaymentOrder order = paymentService.createOrder(user, amount, paymentMethod);
//        PaymentOrder order = paymentService.createOrder(user, amountInSmallestUnit, paymentMethod);

        if(paymentMethod.equals(PaymentMethod.RAZORPAY)) {
            paymentResponse = paymentService.createRezorpayPaymentLing(user, amountInSmallestUnit, order.getId());
        } else {
            paymentResponse = paymentService.createStripePaymentLing(user, amount, order.getId());

//            paymentResponse = paymentService.createStripePaymentLing(user, amountInSmallestUnit, order.getId());   ///////////////
        }
        return new ResponseEntity<>(paymentResponse, HttpStatus.CREATED);
    }
}

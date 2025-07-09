package com.AuthenAvenue.service;

import com.AuthenAvenue.domain.PaymentMethod;
import com.AuthenAvenue.modal.PaymentOrder;
import com.AuthenAvenue.modal.User;
import com.AuthenAvenue.response.PaymentResponse;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;

public interface PaymentService {

    PaymentOrder createOrder(User user, Long amount, PaymentMethod paymentMethod);

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    Boolean ProceedPaymentOrder(PaymentOrder paymentOrder, String paymentId) throws RazorpayException;

    PaymentResponse createRezorpayPaymentLing(User user, Long amount, Long orderId) throws RazorpayException;

    PaymentResponse createStripePaymentLing(User user, Long amount, Long orderId) throws StripeException;
}

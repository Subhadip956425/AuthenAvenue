package com.AuthenAvenue.service;

import com.AuthenAvenue.modal.PaymentDetails;
import com.AuthenAvenue.modal.User;

public interface PaymentDetailsService {

    public PaymentDetails addPaymentDetails(String accountNumber, String accountHolderName, String ifsc, String bankName, User user);

    public PaymentDetails getUsersPaymentDetails(User user);
}
